import { atom, read, update } from 'claude-code'
import type { ElementConstructor, EngineInterface, Register, SelectProps } from 'claude-code'

import { badge, band, STAGE } from './scene'
import type { CollectionId, Song } from './song'
import {
  assetOf,
  COLLECTIONS,
  collectionsInUse,
  hasSettings,
  SONGS,
  songOf,
  songsIn,
  SOUND_PROFILES,
  soundOf,
  soundsOf,
  VOICE_STYLES,
  voiceOf,
  voicesOf,
} from './song'

const run = atom({ plugin: 'serenata', key: 'run' } as const, null)
const isShown = atom({ plugin: 'serenata', key: 'isShown' } as const, true)
const songId = atom({ plugin: 'serenata', key: 'songId' } as const, songOf(null).id)
// What each song is set to, by song id: each song keeps its own.
const voices = atom({ plugin: 'serenata', key: 'voices' } as const, {} as Record<string, string>)
const sounds = atom({ plugin: 'serenata', key: 'sounds' } as const, {} as Record<string, string>)
// The song last picked in each collection, by collection id.
const lastSongs = atom({ plugin: 'serenata', key: 'lastSongs' } as const, {} as Record<string, string>)
// Whether the band shows its settings (sound and voice); hidden until asked.
const showSettings = atom({ plugin: 'serenata', key: 'showSettings' } as const, false)

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
// The song is the current one from the first line: a halt() during any wait
// below (Stop, another song, /serenata off) aborts it, and it goes no further.
// It plays only while the band is shown, so no music is ever left with no Stop.
async function sing($: EngineInterface) {
  halt()
  const controller = new AbortController()
  playing = controller
  await update($, run, () => null)
  // The picked song, in the sound and voice it is set to now: what the menus show.
  const { song, sound, voice } = await picked($)
  if (controller.signal.aborted || !(await read($, isShown))) return abandon(controller)
  const asset = assetOf(song, sound, voice)
  // The surface takes a while to set up its first drawing of a session, while
  // the audio starts at once: the first song waits for the quiet band's badge.
  const wait = isWarm ? 150 : 1200
  isWarm = true
  timers.push($.clock.after(wait, () => void start($, controller, song, asset)))
}

async function start($: EngineInterface, controller: AbortController, song: Song, asset: string) {
  // On Windows the song takes about a second to start: the stage waits for it.
  if (isWindows($.plugin.root)) {
    void playOnWindows($, controller, song, asset).catch(() => $.ui.toast('Non riesco a suonare la canzone.'))

    return
  }
  if (!(await showStage($, controller, song))) return
  $.audio
    .play({ asset }, { signal: controller.signal })
    .catch(() => $.ui.toast('Non riesco a suonare la canzone.'))
}

// Draws the stage for the song, unless it was stopped meanwhile, and sees to
// its end: when the clip is over the band is no longer playing (the stage keeps
// its last frame), so picking a song afterwards plays nothing until Canta.
async function showStage($: EngineInterface, controller: AbortController, song: Song) {
  const id = await $.clock.now()
  if (controller.signal.aborted || !(await read($, isShown))) return abandon(controller)
  await update($, run, current => (controller.signal.aborted ? current : { id, song: song.id }))
  if (controller.signal.aborted) return false
  timers.push($.clock.after(Math.ceil(song.duration * 1000), () => void finish($, controller, id)))

  return true
}

// A song that will not play after all: no longer the one playing.
function abandon(controller: AbortController) {
  controller.abort()
  if (playing === controller) playing = null

  return false
}

async function finish($: EngineInterface, controller: AbortController, id: number) {
  if (playing !== controller) return
  playing = null
  await update($, run, current => (current && current.id === id ? { ...current, isOver: true } : current))
}

// The engine's player is macOS's afplay: on Windows $.audio.play plays nothing.
function isWindows(root: string) {
  return /^[A-Za-z]:[\\/]/.test(root)
}

// Windows plays the song with its own media player, through PowerShell. The
// script writes a dot while it plays, so the loop sees a stop in time; leaving
// the loop (or a reload) kills it, and the song with it. The first dot comes
// once the song is really playing, and the stage appears with it.
async function playOnWindows($: EngineInterface, controller: AbortController, song: Song, asset: string) {
  // In a single-quoted PowerShell string each of the four single quotes it knows is doubled.
  const file = `${$.plugin.root}\\${asset.replace(/\//g, '\\')}`.replace(/['\u2018\u2019\u201a\u201b]/g, '$&$&')
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
  const player = $.process.spawn({
    argv: ['powershell.exe', '-NoProfile', '-NonInteractive', '-Command', script],
  })
  let isPlaying = false
  for await (const chunk of player) {
    if (controller.signal.aborted) break
    if (!isPlaying && chunk.stream === 'stdout') {
      isPlaying = true
      if (!(await showStage($, controller, song))) break
    }
  }
  if (!controller.signal.aborted && (await player.result).code !== 0) throw new Error('song failed')
}

async function stop($: EngineInterface) {
  halt()
  await update($, run, () => null)
}

// Remember a choice for the next sessions: in the session's state, and in the
// store. (Each value is named where it is written, as the engine's scan of the
// module asks: one function per value.)
async function rememberVoice($: EngineInterface, id: string, value: string) {
  await $.store.set('voices', await update($, voices, map => ({ ...map, [id]: value })))
}
async function rememberSound($: EngineInterface, id: string, value: string) {
  await $.store.set('sounds', await update($, sounds, map => ({ ...map, [id]: value })))
}
async function rememberLastSong($: EngineInterface, collection: string, id: string) {
  await $.store.set('lastSongs', await update($, lastSongs, map => ({ ...map, [collection]: id })))
}

// Makes a song the picked one, and the last picked of its collection.
async function choose($: EngineInterface, id: string) {
  const song = songOf(id)
  await update($, songId, () => song.id)
  await $.store.set('songId', song.id)
  await rememberLastSong($, song.collection, song.id)

  return song
}

// Picks the song the band plays. A song on stage gives way to the new one at once.
async function pick($: EngineInterface, id: string) {
  await choose($, id)
  if (playing) await sing($)
}

// Picks a collection: its song picked last, or its first.
async function pickCollection($: EngineInterface, id: string) {
  const collection = collectionsInUse().find(c => c === id)
  if (!collection) return
  const songs = songsIn(collection)
  const last = (await read($, lastSongs))[collection]
  const song = songs.find(s => s.id === last) ?? songs[0]
  if (song) await pick($, song.id)
}

// Picks the sound profile, or the voice style, of the picked song, for that song
// alone. A song on stage starts again as it is now set.
async function pickSound($: EngineInterface, sound: string) {
  const song = songOf(await read($, songId))
  await rememberSound($, song.id, soundOf(song, sound))
  if (playing) await sing($)
}
async function pickVoice($: EngineInterface, voice: string) {
  const song = songOf(await read($, songId))
  const sound = soundOf(song, (await read($, sounds))[song.id])
  await rememberVoice($, song.id, voiceOf(song, sound, voice))
  if (playing) await sing($)
}

async function toggleSettings($: EngineInterface) {
  const next = await update($, showSettings, value => !value)
  await $.store.set('showSettings', next)
}

// The song /canta names: its number in the list of all songs, its id, or the start of its title.
function songNamed(arg: string): Song | undefined {
  const text = arg.trim().toLowerCase()
  const number = Number(text)
  if (Number.isInteger(number) && number >= 1) return SONGS[number - 1]

  return SONGS.find(song => song.id === text) ?? SONGS.find(song => song.title.toLowerCase().startsWith(text))
}

const collectionLabel = (id: CollectionId) => COLLECTIONS.find(c => c.id === id)?.label ?? id

// Everything the band's menus draw from, read once per drawing.
type Picked = { song: Song; sound: ReturnType<typeof soundOf>; voice: ReturnType<typeof voiceOf>; isOpen: boolean }

async function picked($: EngineInterface): Promise<Picked> {
  const song = songOf(await read($, songId))
  const sound = soundOf(song, (await read($, sounds))[song.id])
  const voice = voiceOf(song, sound, (await read($, voices))[song.id])

  return { song, sound, voice, isOpen: await read($, showSettings) }
}

type Elements = { Select: ElementConstructor<SelectProps> }

// What the menus and the settings button say: words in the terminal; on the
// desktop a glyph before each menu, so the whole row fits beside the stage.
type Labels = { collection: string; song: string; sound: string; voice: string; open: string; close: string }
const LABELS: Record<'terminal' | 'desktop', Labels> = {
  terminal: { collection: 'Raccolta:', song: 'Canzone:', sound: 'Suono:', voice: 'Voce:', open: '⚙ Impostazioni', close: '⚙ Nascondi' },
  desktop: { collection: '💿', song: '🎵', sound: '🎸', voice: '🎤', open: '⚙ Impostazioni', close: '⚙' },
}

// The menus of what plays: the collection (when there is more than one), then
// the songs of that collection.
function songMenus($: EngineInterface, { Select }: Elements, { song }: Picked, labels: Labels) {
  const collections = collectionsInUse()
  const collection =
    collections.length > 1 ? (
      <Select
        key="collection"
        label={labels.collection}
        options={collections.map(id => ({ value: id, label: collectionLabel(id) }))}
        value={song.collection}
        onSelect={value => void pickCollection($, value)}
      />
    ) : null
  const songs = (
    <Select
      key="song"
      label={labels.song}
      options={songsIn(song.collection).map(s => ({ value: s.id, label: s.title }))}
      value={song.id}
      onSelect={value => void pick($, value)}
    />
  )

  return [collection, songs]
}

// The settings, at the right of the band: a button that shows or hides them,
// drawn only when the song has something to set, and when shown, the menus of
// its sound profile and its voice style, each only when it offers a choice.
function settings(
  $: EngineInterface,
  { Select, Button }: Elements & { Button: ElementConstructor<{ key: string; label: string; onPress: () => void }> },
  p: Picked,
  labels: Labels,
) {
  if (!hasSettings(p.song, p.sound)) return []
  const toggle = <Button key="settings" label={p.isOpen ? labels.close : labels.open} onPress={() => void toggleSettings($)} />
  if (!p.isOpen) return [toggle]
  const profiles = soundsOf(p.song)
  const styles = voicesOf(p.song, p.sound)
  const sound =
    profiles.length > 1 ? (
      <Select
        key="sound"
        label={labels.sound}
        options={SOUND_PROFILES.filter(s => profiles.includes(s.id)).map(s => ({ value: s.id, label: s.label }))}
        value={p.sound}
        onSelect={value => void pickSound($, value)}
      />
    ) : null
  const voice =
    styles.length > 1 ? (
      <Select
        key="voice"
        label={labels.voice}
        options={VOICE_STYLES.filter(s => styles.includes(s.id)).map(s => ({ value: s.id, label: s.label }))}
        value={p.voice}
        onSelect={value => void pickVoice($, value)}
      />
    ) : null

  return [sound, voice, toggle]
}

// Shows or hides the band, and remembers the choice for the next sessions.
async function show($: EngineInterface, value: boolean) {
  if (!value) await stop($)
  await update($, isShown, () => value)
  await $.store.set('isShown', value)
}

// A map of strings kept in the store by an earlier session, without what is not one.
function storedMap(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}

  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string'))
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
      description: 'Claude e la sua band cantano la canzone scelta',
      argumentHint: '[numero o nome della canzone]',
    })
    if ((await $.store.get('isShown')) === false) await update($, isShown, () => false)
    // A song picked in an earlier session, if it is still in the list.
    const stored = await $.store.get('songId')
    if (typeof stored === 'string') await update($, songId, () => songOf(stored).id)
    // What each song and collection was set to in earlier sessions, and the settings' flag.
    const storedVoices = storedMap(await $.store.get('voices'))
    await update($, voices, () => storedVoices)
    const storedSounds = storedMap(await $.store.get('sounds'))
    await update($, sounds, () => storedSounds)
    const storedLastSongs = storedMap(await $.store.get('lastSongs'))
    await update($, lastSongs, () => storedLastSongs)
    if ((await $.store.get('showSettings')) === true) await update($, showSettings, () => true)
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
  // `/canta 2` or `/canta serenata` picks the song first.
  on('command.run', { command: 'canta' }, async ($, e) => {
    if (e.args.trim()) {
      const song = songNamed(e.args)
      if (!song) {
        const list = SONGS.map((s, i) => `${i + 1}. ${s.title} (${collectionLabel(s.collection)})`).join('\n')

        return { text: `Non conosco questa canzone. Quelle che so:\n${list}` }
      }
      await choose($, song.id)
    }
    await show($, true)
    await sing($)

    return { text: `Claude sta cantando «${songOf(await read($, songId)).title}» ♥` }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || !(await read($, isShown))) return next(e)
    const current = await read($, run)
    const p = await picked($)

    if (e.surface === 'desktop') {
      const { Box, Button, Select, Svg, Text } = $.ui.resolve(e)
      // Left, what to play; right, how. Both halves grow to share the row, so
      // the settings keep to the right edge, on the row below too when a
      // narrow band wraps them.
      const row = (left: JSX.Element[]) => (
        <Box flexDirection="row" flexWrap="wrap">
          <Box flexDirection="row" flexWrap="wrap" flexGrow={1}>
            {left}
            {songMenus($, { Select }, p, LABELS.desktop)}
          </Box>
          <Box flexDirection="row" flexWrap="wrap" flexGrow={1} justifyContent="flex-end">
            {settings($, { Select, Button }, p, LABELS.desktop)}
          </Box>
        </Box>
      )
      if (!current) {
        return row([
          <Svg key="badge" source={badge()} alt="Claude in pixel art accanto a un cuore" isInteractive width={64} height={32} />,
          <Text key="title"> Claude canta per te </Text>,
          <Button key="sing" variant="primary" label="▶ Canta" onPress={() => void sing($)} />,
        ])
      }

      // The desktop's interactive frame takes no size of its own (left to it,
      // it comes up 300 by 150 pixels), and the band tells its width in cells
      // only. A cell of the desktop's band measured 8.85 pixels of drawing room,
      // or 8.5 a cell counting the five the band keeps at its right end, less the
      // band's padding: the smaller of the two readings, so the stage never
      // overflows the band, at most a few pixels short of it.
      const cells = e.props.bodyColumns
      const width = Math.floor(Math.min(1600, Math.max(360, Math.min(cells * 8.85, (cells + 5) * 8.5 - 16))))
      const onStage = songOf(current.song)

      return (
        <Box flexDirection="column">
          <Box key={`stage-${current.id}`}>
            <Svg
              source={band(current.id, onStage)}
              alt={`Claude e la sua band cantano «${onStage.title}»`}
              isInteractive
              width={width}
              height={Math.round((width * STAGE.height) / STAGE.width)}
            />
          </Box>
          {row([
            <Button key="sing" label="▶ Ancora" onPress={() => void sing($)} />,
            <Button key="stop" label="■ Stop" onPress={() => void stop($)} />,
          ])}
        </Box>
      )
    }

    if (e.surface === 'terminal') {
      const { Box, Button, Select, Text } = $.ui.resolve(e)

      return (
        <Box flexDirection="row" flexWrap="wrap">
          <Text>{current && !current.isOver ? '♪ Claude sta cantando… ' : '🌹 Claude canta per te '}</Text>
          {current && !current.isOver ? (
            <Button key="stop" label="■ Stop" onPress={() => void stop($)} />
          ) : (
            <Button key="sing" variant="primary" label="▶ Canta" onPress={() => void sing($)} />
          )}
          {songMenus($, { Select }, p, LABELS.terminal)}
          {settings($, { Select, Button }, p, LABELS.terminal)}
        </Box>
      )
    }

    return next(e)
  })
}
