import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import { badge, band, STAGE } from './scene'

const SONG_ASSET = 'audio/canzone.m4a'

const run = atom({ plugin: 'serenata', key: 'run' } as const, null)
const isShown = atom({ plugin: 'serenata', key: 'isShown' } as const, true)

// What plays now; a reload starts these over, and its audio ends on its own.
let playing: AbortController | null = null
let timers: { cancel: () => void }[] = []
// Whether a song has started since the module loaded (see sing).
let isWarm = false

function halt() {
  playing?.abort()
  playing = null
  timers.forEach(timer => timer.cancel())
  timers = []
}

// The stage's animations count from the moment its drawing is created, so each
// song clears the stage first and draws a new one a moment later, with the audio.
async function sing($: EngineInterface) {
  halt()
  await update($, run, () => null)
  const controller = new AbortController()
  playing = controller
  // The surface takes a while to set up its first drawing of a session, while
  // the audio starts at once: the first song waits for the quiet band's badge.
  const wait = isWarm ? 150 : 1200
  isWarm = true
  timers.push($.clock.after(wait, () => void start($, controller)))
}

async function start($: EngineInterface, controller: AbortController) {
  // On Windows the song takes about a second to start: the stage waits for it.
  if (isWindows($.plugin.root)) {
    void playOnWindows($, controller).catch(() => $.ui.toast('Non riesco a suonare la canzone.'))

    return
  }
  await showStage($)
  $.audio
    .play({ asset: SONG_ASSET }, { signal: controller.signal })
    .catch(() => $.ui.toast('Non riesco a suonare la canzone.'))
}

async function showStage($: EngineInterface) {
  const id = await $.clock.now()
  await update($, run, () => ({ id }))
}

// The engine's player is macOS's afplay: on Windows $.audio.play plays nothing.
function isWindows(root: string) {
  return /^[A-Za-z]:[\\/]/.test(root)
}

// Windows plays the song with its own media player, through PowerShell. The
// script writes a dot while it plays, so the loop sees a stop in time; leaving
// the loop (or a reload) kills it, and the song with it. The first dot comes
// once the song is really playing, and the stage appears with it.
async function playOnWindows($: EngineInterface, controller: AbortController) {
  const file = `${$.plugin.root}\\${SONG_ASSET.replace(/\//g, '\\')}`.replace(/'/g, "''")
  const script = [
    'Add-Type -AssemblyName PresentationCore',
    '$p = New-Object System.Windows.Media.MediaPlayer',
    `$p.Open([uri]'${file}')`,
    '$p.Play()',
    '$i = 0',
    'while (-not $p.NaturalDuration.HasTimeSpan -and $i -lt 50) { Start-Sleep -Milliseconds 100; $i++ }',
    'if (-not $p.NaturalDuration.HasTimeSpan) { exit 1 }',
    'while ($p.Position.TotalMilliseconds -le 0 -and $i -lt 150) { Start-Sleep -Milliseconds 20; $i++ }',
    "while ($p.Position -lt $p.NaturalDuration.TimeSpan) { Write-Output '.'; Start-Sleep -Milliseconds 200 }",
  ].join('; ')
  const song = $.process.spawn({
    argv: ['powershell.exe', '-NoProfile', '-NonInteractive', '-Command', script],
  })
  let isPlaying = false
  for await (const chunk of song) {
    if (controller.signal.aborted) break
    if (!isPlaying && chunk.stream === 'stdout') {
      isPlaying = true
      await showStage($)
    }
  }
  if (!controller.signal.aborted && (await song.result).code !== 0) throw new Error('song failed')
}

async function stop($: EngineInterface) {
  halt()
  await update($, run, () => null)
}

// Shows or hides the band, and remembers the choice for the next sessions.
async function show($: EngineInterface, value: boolean) {
  if (!value) await stop($)
  await update($, isShown, () => value)
  await $.store.set('isShown', value)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'serenata',
      description: 'Accende o spegne la band di Claude sopra il prompt',
      argumentHint: 'on|off',
    })
    await $.command.register({
      name: 'canta',
      description: 'Claude e la sua band cantano, e una rosa sboccia',
    })
    if ((await $.store.get('isShown')) === false) await update($, isShown, () => false)
    // A song from before a reload has no audio any more: start from the quiet band.
    await update($, run, () => null)

    return next(e)
  })

  on('session.end', ($, e, next) => {
    halt()

    return next(e)
  })

  on('command.run', { command: 'serenata' }, async ($, e) => {
    const arg = e.args.trim().toLowerCase()
    if (arg === 'on') {
      await show($, true)

      return { text: 'Band accesa: premi ▶ Canta o scrivi /canta.' }
    }
    if (arg === 'off') {
      await show($, false)

      return { text: 'Band spenta. /serenata on per riaccenderla.' }
    }

    return { text: `La band è ${(await read($, isShown)) ? 'accesa' : 'spenta'}: usa /serenata on oppure /serenata off.` }
  })

  // Singing needs the band on stage, so /canta turns it on.
  on('command.run', { command: 'canta' }, async $ => {
    await show($, true)
    await sing($)

    return { text: 'Claude sta cantando ♥' }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || !(await read($, isShown))) return next(e)
    const current = await read($, run)

    if (e.surface === 'desktop') {
      const { Box, Button, Svg, Text } = $.ui.resolve(e)
      if (!current) {
        return (
          <Box flexDirection="row">
            <Svg source={badge()} alt="Claude in pixel art accanto a un cuore" isInteractive width={64} height={32} />
            <Text> Claude canta per te </Text>
            <Button key="sing" variant="primary" label="▶ Canta" onPress={() => void sing($)} />
          </Box>
        )
      }

      // The drawing has no size of its own in the band: give it the band's width.
      const width = Math.round(Math.min(1600, Math.max(360, e.props.bodyColumns * 8)))

      return (
        <Box flexDirection="column">
          <Box key={`stage-${current.id}`}>
            <Svg
              source={band(current.id)}
              alt="Claude canta con la sua band mentre una rosa cresce e sboccia"
              isInteractive
              width={width}
              height={Math.round((width * STAGE.height) / STAGE.width)}
            />
          </Box>
          <Box flexDirection="row">
            <Button key="sing" label="▶ Ancora" onPress={() => void sing($)} />
            <Button key="stop" label="■ Stop" onPress={() => void stop($)} />
          </Box>
        </Box>
      )
    }

    if (e.surface === 'terminal') {
      const { Box, Button, Text } = $.ui.resolve(e)

      return (
        <Box flexDirection="row">
          <Text>{current ? '♪ Claude sta cantando… ' : '🌹 Claude canta per te '}</Text>
          {current ? (
            <Button key="stop" label="■ Stop" onPress={() => void stop($)} />
          ) : (
            <Button key="sing" variant="primary" label="▶ Canta" onPress={() => void sing($)} />
          )}
        </Box>
      )
    }

    return next(e)
  })
}
