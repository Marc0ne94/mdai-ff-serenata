import type { On } from 'claude-code'
import { expect, mock, test } from 'claude-code/testing'

import { band } from '../hooks/scene'
import { SCENERIES } from '../hooks/sets'
import { flight } from '../hooks/sets/codice'
import { PROFILES, STYLES } from '../tools/profiles.mjs'
import type { Song } from '../hooks/song'
import { ambienceOf, assetOf, hasSettings, partsOf, sectionsOf, songOf, SONGS, songsIn, SOUND_PROFILES, soundOf, soundsOf, VOICE_STYLES, voiceOf, voicesOf } from '../hooks/song'

const BAND = {
  plugin: 'serenata',
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 20,
    bodyColumns: 80,
    scroll: { offset: 0, bodyRows: 19 },
    view: {},
  },
} as const

// A command as the person types it at the prompt.
const typed = (command: string, args = '') => ({
  command,
  args,
  origin: { kind: 'composer' },
  presentation: { isFullscreen: false, columns: 80 },
}) as const

test('Canta in the band plays the song and draws the stage', async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  const played: string[] = []
  on('audio.play', (_, e) => {
    played.push(String(e.clip.asset))

    return { value: undefined }
  })
  // On Windows the song plays through PowerShell's media player instead.
  on('process.spawn', async function* (_, e) {
    const command = e.argv.join(' ')
    if (command.includes('MediaPlayer') && command.includes('fable.m4a')) played.push('audio/fable.m4a')

    return { value: { code: 0, signal: null } }
  })

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  const stageOf = async () => (await ui.findAll({ type: 'Svg' })).map(svg => String(svg.props.source)).find(source => source.includes('<!-- run'))
  expect(await stageOf()).toBeUndefined()

  // The first song of a session waits for the surface to be ready.
  await ui.press({ key: 'sing' })
  await clock.advance(1000)
  expect(played).toEqual([])
  await clock.advance(300)
  // A new install starts on the newest song, Fable 5.2.
  expect(played).toEqual(['audio/fable.m4a'])

  const stage = String(await stageOf())
  expect(stage).toContain('<!-- run 2200 -->')
  // No subtitles on the stage, the signature in its corner, the band's width.
  expect(stage).not.toContain('qualcuno')
  expect(stage).toContain('M2V-MDO')
  const drawn = (await ui.findAll({ type: 'Svg' })).find(svg => String(svg.props.source).includes('<!-- run'))?.props
  // 80 cells: 85 × 8.5 − 16 = 706 pixels, the smaller reading; the stage's proportions.
  expect([drawn?.width, drawn?.height]).toEqual([706, 146])
  expect(stage.length).toBeLessThan(131072)

  // Ancora clears the stage, then draws a new one that starts from the beginning.
  await ui.press({ key: 'sing' })
  expect(await stageOf()).toBeUndefined()
  await clock.advance(200)
  expect(await stageOf()).toContain('<!-- run 2450 -->')
  expect(await ui.find({ key: 'stage-2450' })).toBeDefined()
  expect(played).toHaveLength(2)

  await ui.press({ key: 'stop' })
  expect(await stageOf()).toBeUndefined()
  await ui.unmount()
})

test('/serenata off hides the band and /serenata on brings it back', async ($, on) => {
  mock.clock(on)
  mock.store(on)
  // Nothing draws beneath the mod in a test: this hook stands for the engine.
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>engine</Text>
  })

  expect((await $.command.run(typed('serenata', 'off'))).text).toContain('spenta')
  const hidden = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await hidden.find({ key: 'sing' })).toBeUndefined()
  expect((await hidden.find({ type: 'Text' }))?.text).toBe('engine')
  await hidden.unmount()

  expect((await $.command.run(typed('serenata', 'on'))).text).toContain('accesa')
  const shown = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await shown.find({ key: 'sing' })).toBeDefined()
  await shown.unmount()
})

test('the terminal band offers the song in one row', async ($, on) => {
  mock.clock(on)

  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: /Claude canta/ })).toBeDefined()
  expect(await ui.find({ key: 'sing' })).toBeDefined()
  // The terminal says the menus in words.
  expect((await ui.find({ key: 'collection' }))?.props.label).toBe('Raccolta:')
  expect((await ui.find({ key: 'song' }))?.props.label).toBe('Canzone:')
  await ui.unmount()
})

// A store in memory the test can look into, as the engine keeps the mod's own.
function storeIn(on: On, entries: Record<string, unknown> = {}) {
  const memory: Record<string, unknown> = { ...entries }
  on('store.get', (_, e) => ({ value: memory[e.key] }))
  on('store.set', (_, e) => {
    memory[e.key] = e.value

    return { value: undefined }
  })

  return memory
}

// The song a stage is drawn for, from the comment band() writes into it.
const songOnStage = async (ui: { findAll: (q: { type: string }) => Promise<{ props: Record<string, unknown> }[]> }) =>
  (await ui.findAll({ type: 'Svg' }))
    .map(svg => String(svg.props.source))
    .map(source => /<!-- song (\S+) -->/.exec(source)?.[1])
    .find(Boolean)

test('the menus list the collections and the songs of the picked one, beside Canta and beside Ancora and Stop', async ($, on) => {
  const clock = mock.clock(on)
  on('audio.play', () => ({ value: undefined }))

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  const collection = await ui.find({ key: 'collection' })
  expect(collection?.type).toBe('Select')
  expect((collection?.props.options as { value: string }[]).map(o => o.value)).toEqual(['band', 'hana', 'odissea', 'mdo', 'carica'])
  expect(collection?.props.value).toBe('carica')
  const quiet = await ui.find({ key: 'song' })
  expect(quiet?.type).toBe('Select')
  expect((quiet?.props.options as { value: string }[]).map(o => o.value)).toEqual(['centottanta', 'cutover', 'venerdi', 'fable'])
  expect(quiet?.props.value).toBe('fable')

  await ui.press({ key: 'sing' })
  await clock.advance(1300)
  expect(await ui.find({ key: 'stop' })).toBeDefined()
  expect((await ui.find({ key: 'song' }))?.type).toBe('Select')
  await ui.unmount()
})

test('picking a song while the band plays starts it from the beginning', async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  const memory = storeIn(on)
  const played: string[] = []
  on('audio.play', (_, e) => {
    played.push(String(e.clip.asset))

    return { value: undefined }
  })

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await ui.press({ key: 'sing' })
  await clock.advance(1300)
  expect(await songOnStage(ui)).toBe('fable')

  await ui.select({ key: 'song', value: 'cutover' })
  // The old stage goes at once, the new one comes with its audio.
  expect(await songOnStage(ui)).toBeUndefined()
  await clock.advance(200)
  expect(await songOnStage(ui)).toBe('cutover')
  expect(played).toHaveLength(2)
  expect((await ui.find({ key: 'song' }))?.props.value).toBe('cutover')
  expect(memory.songId).toBe('cutover')
  await ui.unmount()
})

test('picking a song while the band is quiet plays nothing', async ($, on) => {
  const clock = mock.clock(on)
  mock.store(on)
  const played: string[] = []
  on('audio.play', (_, e) => {
    played.push(String(e.clip.asset))

    return { value: undefined }
  })

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await ui.select({ key: 'song', value: 'cutover' })
  await clock.advance(2000)
  expect(played).toEqual([])
  expect(await songOnStage(ui)).toBeUndefined()
  expect((await ui.find({ key: 'song' }))?.props.value).toBe('cutover')

  // Canta then plays the picked song.
  await ui.press({ key: 'sing' })
  await clock.advance(1300)
  expect(await songOnStage(ui)).toBe('cutover')
  await ui.unmount()
})

test('/canta picks a song by number or by name, and lists them for anything else', async ($, on) => {
  const clock = mock.clock(on)
  mock.store(on)
  const played: string[] = []
  on('audio.play', (_, e) => {
    played.push(String(e.clip.asset))

    return { value: undefined }
  })
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })

  expect((await $.command.run(typed('canta', '2'))).text).toContain('Tutto pronto')
  await clock.advance(1300)
  expect(await songOnStage(ui)).toBe('canzone-2')
  // Each song plays its own audio.
  expect(played).toEqual(['audio/tutto-pronto.m4a'])

  expect((await $.command.run(typed('canta', 'Serenata'))).text).toContain('Serenata')
  await clock.advance(200)
  expect(await songOnStage(ui)).toBe('serenata')
  expect(played).toEqual(['audio/tutto-pronto.m4a', 'audio/canzone.m4a'])

  // An unknown song changes nothing: the band keeps singing what it sang.
  for (const arg of [String(SONGS.length + 1), '0', 'boh', '-1']) {
    const { text } = await $.command.run(typed('canta', arg))
    expect(text).toContain('Non conosco')
    expect(text).toContain('1. Serenata')
  }
  await clock.advance(200)
  expect(await songOnStage(ui)).toBe('serenata')
  expect(played).toHaveLength(2)

  // Without a name it sings the picked song again.
  expect((await $.command.run(typed('canta'))).text).toContain('Serenata')
  await ui.unmount()
})

test('a session starts with the song picked last time, or the newest if it is gone', async ($, on) => {
  mock.clock(on)
  const memory = storeIn(on, { songId: 'canzone-3' })
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  // The engine's side of registering /serenata and /canta.
  on('command.register', (_, e) => ({ value: { command: e.name } }))
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect((await ui.find({ key: 'song' }))?.props.value).toBe('canzone-3')
  await ui.unmount()

  memory.songId = 'una-canzone-tolta'
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  const again = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect((await again.find({ key: 'song' }))?.props.value).toBe('fable')
  await again.unmount()
})

test('the terminal band has the menu too', async ($, on) => {
  mock.clock(on)

  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect((await ui.find({ key: 'song' }))?.type).toBe('Select')
  await ui.unmount()
})

// Two times the same to the millisecond the timing files are rounded to.
const near = (a: number, b: number) => Math.abs(a - b) < 0.005

test('every song keeps the form the stage follows', () => {
  const ids = SONGS.map(song => song.id)
  expect(new Set(ids).size).toBe(ids.length)
  const assets = SONGS.flatMap(song => soundsOf(song).flatMap(sound => voicesOf(song, sound).map(voice => assetOf(song, sound, voice))))
  // Every audio file belongs to one pair of one song.
  expect(new Set(assets).size).toBe(assets.length)
  for (const song of SONGS) {
    // At least one profile with at least one voice style, each pair with its audio.
    expect(soundsOf(song).length).toBeGreaterThan(0)
    for (const sound of soundsOf(song)) {
      expect(voicesOf(song, sound).length).toBeGreaterThan(0)
      for (const voice of voicesOf(song, sound)) expect(assetOf(song, sound, voice)).toMatch(/^audio\/[a-z0-9-]+\.m4a$/)
    }
    expect(near(song.bar, 4 * song.beat)).toBe(true)
    // Its sections one after the other, whole bars, from the intro to the outro, with a drop.
    const sections = sectionsOf(song)
    expect(sections[0]?.part).toBe('intro')
    expect(sections.at(-1)?.part).toBe('outro')
    expect(sections.filter(s => s.part === 'intro' || s.part === 'outro')).toHaveLength(2)
    expect(partsOf(song, 'drop').length).toBeGreaterThan(0)
    sections.forEach((section, i) => {
      expect(near(section.start, i === 0 ? 0 : (sections[i - 1]?.end ?? -1))).toBe(true)
      expect(near(section.end / song.bar, Math.round(section.end / song.bar))).toBe(true)
    })
    expect(near(song.outroAt, sections.at(-1)?.start ?? -1)).toBe(true)
    expect(song.duration).toBeGreaterThan(sections.at(-1)?.end ?? Infinity)
    if (!song.sections) {
      // The first form: six lines of two bars from bar 2, the outro at bar 14.
      expect(song.lines).toHaveLength(6)
      song.lines.forEach((line, i) => expect(near(line.start, (2 + 2 * i) * song.bar)).toBe(true))
      expect(near(song.outroAt, 14 * song.bar)).toBe(true)
    }
    // The lines between the intro and the outro, none over another; the rose
    // blooms at the last before the first drop, the finale at the first in it.
    const firstDrop = partsOf(song, 'drop')[0]!
    song.lines.forEach((line, i) => {
      expect(line.start).toBeGreaterThanOrEqual((sections[0]?.end ?? 0) - 0.001)
      expect(line.end).toBeLessThanOrEqual(song.outroAt + 0.001)
      if (i > 0) expect(line.start).toBeGreaterThanOrEqual((song.lines[i - 1]?.end ?? 0) - 0.001)
    })
    expect(song.bloomAt).toBe(song.lines.filter(line => line.start < firstDrop.start - 0.001).at(-1)?.start)
    expect(song.finaleAt).toBe(song.lines.find(line => line.start >= firstDrop.start - 0.001)?.start)
    for (const line of song.lines) {
      for (const syl of line.syls) {
        expect(syl.end).toBeGreaterThan(syl.start)
        expect(syl.end).toBeLessThanOrEqual(song.outroAt + 0.001)
      }
    }
    // The surface draws no Svg past 131,072 characters.
    expect(band(1, song).length).toBeLessThan(131072)
  }
})

test('every scenery fits the stage, and each song draws its own', () => {
  for (const [name, scenery] of Object.entries(SCENERIES)) {
    // The gadget's grid puts the hand where the singer's arm is.
    expect(scenery.gadget.pixels).toHaveLength(15)
    for (const row of scenery.gadget.pixels) {
      expect(row).toHaveLength(9)
      for (const c of row) if (c !== '.') expect(scenery.gadget.colors[c]).toBeDefined()
    }
    // Its own ids start with its name, so two sceneries never clash.
    for (const [, id] of (scenery.defs ?? '').matchAll(/id="([^"]+)"/g)) expect(id?.startsWith(name)).toBe(true)
  }
  const stageOf = (id: string) => band(1, SONGS.find(song => song.id === id) ?? SONGS[0]!)
  expect(stageOf('serenata')).toContain('CLAUDE CANTA')
  expect(stageOf('serenata')).not.toContain('codiceGlow')
  expect(stageOf('canzone-2')).toContain('TUTTO PRONTO')
  expect(stageOf('canzone-2')).toContain('url(#codiceGlow)')
  expect(stageOf('canzone-2')).toContain('FATTO')
  expect(stageOf('canzone-3')).toContain('GO-LIVE')
  expect(stageOf('canzone-3')).toContain('url(#goliveGlow)')
  expect(stageOf('canzone-3')).toContain('>PRD<')
  expect(stageOf('odissea')).toContain('ODISSEA')
  expect(stageOf('odissea')).toContain('url(#tempioSky)')
  expect(stageOf('dipende-da-me')).toContain('DIPENDE DA ME')
  expect(stageOf('hana-di-notte')).toContain('HANA DI NOTTE')
  expect(stageOf('in-principio')).toContain('IN PRINCIPIO FU IL MAV')
  expect(stageOf('in-principio')).toContain('>M4V<')
  expect(stageOf('so-di-non-sapere')).toContain('SO DI NON SAPERE')
  expect(stageOf('un-altro-me-stesso')).toContain('UN ALTRO ME STESSO')
  expect(stageOf('un-altro-me-stesso')).toContain('url(#liceoSky)')
  // Every song of the classical album names where its words come from.
  for (const song of SONGS.filter(s => s.collection === 'odissea')) expect(song.source?.length).toBeGreaterThan(10)
  expect(stageOf('so-di-non-sapere')).toContain('url(#delfiSky)')
  expect(SONGS.find(s => s.id === 'so-di-non-sapere')?.source).toContain('Apologia')
  expect(stageOf('hana-di-notte')).toContain('url(#hanaDawn)')
  expect(stageOf('dipende-da-me')).toContain('url(#stoaStorm)')
  // A song whose words follow a text names it.
  expect(SONGS.find(s => s.id === 'dipende-da-me')?.source).toContain('Epitteto')
})

test('the settings sit at the right, only for a song with a choice, and each song keeps its own', async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  const memory = storeIn(on)
  const played: string[] = []
  on('audio.play', (_, e) => {
    played.push(String(e.clip.asset))

    return { value: undefined }
  })
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  const voice = async () => (await ui.find({ key: 'voice' }))?.props

  // Fable 5.2, the first song of a new install, has nothing to set: no settings at all.
  expect(await ui.find({ key: 'settings' })).toBeUndefined()

  // Go-live, in the band, is sung in two styles: the settings are there, hidden until asked.
  await ui.select({ key: 'collection', value: 'band' })
  await ui.select({ key: 'song', value: 'canzone-3' })
  expect(await ui.find({ key: 'voice' })).toBeUndefined()
  expect((await ui.find({ key: 'settings' }))?.props.label).toBe('⚙ Impostazioni')
  await ui.press({ key: 'settings' })
  // On the desktop a glyph labels each menu, so the row fits beside the stage.
  expect((await ui.find({ key: 'settings' }))?.props.label).toBe('⚙')
  expect(memory.showSettings).toBe(true)
  expect((await voice())?.label).toBe('🎤')
  expect(((await voice())?.options as { value: string }[]).map(o => o.value)).toEqual(['classico', 'avanzato'])
  expect((await voice())?.value).toBe('classico')
  // The band's songs are played in one profile only: no sound menu for them.
  expect(await ui.find({ key: 'sound' })).toBeUndefined()

  // Avanzato for Go-live, while it plays: it starts again in that style.
  await ui.press({ key: 'sing' })
  await clock.advance(1300)
  await ui.select({ key: 'voice', value: 'avanzato' })
  await clock.advance(200)
  expect(played).toEqual(['audio/go-live.m4a', 'audio/go-live-avanzato.m4a'])
  expect(await songOnStage(ui)).toBe('canzone-3')

  // The Serenata plays as it is, with no menus.
  await ui.select({ key: 'song', value: 'serenata' })
  await clock.advance(200)
  expect(await ui.find({ key: 'voice' })).toBeUndefined()
  expect(played.at(-1)).toBe('audio/canzone.m4a')

  // Back to Go-live: Avanzato again, and remembered for the next sessions.
  await ui.select({ key: 'song', value: 'canzone-3' })
  await clock.advance(200)
  expect((await voice())?.value).toBe('avanzato')
  expect(played.at(-1)).toBe('audio/go-live-avanzato.m4a')
  expect(memory.voices).toEqual({ 'canzone-3': 'avanzato' })

  // Hidden again: the menus go, the choices stay.
  await ui.press({ key: 'settings' })
  expect(await ui.find({ key: 'voice' })).toBeUndefined()
  expect(memory.showSettings).toBe(false)
  await ui.unmount()
})

test('a session starts with the style of each song from last time, skipping what is not a style', async ($, on) => {
  mock.clock(on)
  storeIn(on, { songId: 'canzone-3', showSettings: true, voices: { 'canzone-3': 'avanzato', serenata: 42, altro: 'boh' } })
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('command.register', (_, e) => ({ value: { command: e.name } }))
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect((await ui.find({ key: 'voice' }))?.props.value).toBe('avanzato')
  await ui.select({ key: 'collection', value: 'odissea' })
  expect((await ui.find({ key: 'voice' }))?.props.value).toBe('classico')
  await ui.unmount()
})

test('a profile or a style a song does not declare is never offered nor played', () => {
  const base = SONGS[0]!
  const only: Song = { ...base, audio: { dita: { avanzato: 'audio/solo-avanzato.m4a' } } }
  expect(soundsOf(only)).toEqual(['dita'])
  expect(voicesOf(only, 'dita')).toEqual(['avanzato'])
  // What is picked elsewhere, or nothing, falls back to the song's first.
  expect(soundOf(only, 'pop')).toBe('dita')
  expect(voiceOf(only, 'dita', 'classico')).toBe('avanzato')
  expect(voiceOf(only, 'dita', undefined)).toBe('avanzato')
  expect(assetOf(only, soundOf(only, 'pop'), voiceOf(only, 'dita', 'classico'))).toBe('audio/solo-avanzato.m4a')
  expect(voiceOf(base, 'pop', 'nessuno')).toBe('classico')
  // Nothing to set, no settings: one profile, one style.
  expect(hasSettings(only, 'dita')).toBe(false)
  expect(hasSettings(base, 'pop')).toBe(false)
  expect(hasSettings(SONGS.find(s => s.id === 'canzone-3')!, 'pop')).toBe(true)
})

test('the terminal band has the collections and the settings too', async ($, on) => {
  mock.clock(on)
  mock.store(on)

  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect((await ui.find({ key: 'collection' }))?.type).toBe('Select')
  await ui.select({ key: 'collection', value: 'band' })
  await ui.select({ key: 'song', value: 'canzone-3' })
  await ui.press({ key: 'settings' })
  expect((await ui.find({ key: 'voice' }))?.type).toBe('Select')
  await ui.unmount()
})

test('picking a collection plays its song picked last, or its first', async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  const memory = storeIn(on)
  const played: string[] = []
  on('audio.play', (_, e) => {
    played.push(String(e.clip.asset))

    return { value: undefined }
  })
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  const options = async () => ((await ui.find({ key: 'song' }))?.props.options as { value: string }[]).map(o => o.value)

  // Go-live in the band, then to Odissea: its first song, and only its songs in the menu.
  await ui.select({ key: 'collection', value: 'band' })
  await ui.select({ key: 'song', value: 'canzone-3' })
  await ui.press({ key: 'sing' })
  await clock.advance(1300)
  await ui.select({ key: 'collection', value: 'odissea' })
  await clock.advance(200)
  expect(await songOnStage(ui)).toBe('odissea')
  expect((await ui.find({ key: 'collection' }))?.props.value).toBe('odissea')
  expect(await options()).toEqual(songsIn('odissea').map(s => s.id))

  // Back to the band: Go-live again, the song picked last there.
  await ui.select({ key: 'collection', value: 'band' })
  await clock.advance(200)
  expect(await songOnStage(ui)).toBe('canzone-3')
  expect(memory.lastSongs).toEqual({ band: 'canzone-3', odissea: 'odissea' })
  expect(played).toEqual(['audio/go-live.m4a', 'audio/odissea.m4a', 'audio/go-live.m4a'])

  // A collection that is not one changes nothing.
  await ui.select({ key: 'collection', value: 'nessuna' })
  expect((await ui.find({ key: 'song' }))?.props.value).toBe('canzone-3')
  await ui.unmount()
})

test('Odissea is played with a plectrum or with the fingertips, each song keeping its own', async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  const memory = storeIn(on, { showSettings: true })
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('command.register', (_, e) => ({ value: { command: e.name } }))
  const played: string[] = []
  on('audio.play', (_, e) => {
    played.push(String(e.clip.asset))

    return { value: undefined }
  })
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })

  await ui.select({ key: 'collection', value: 'odissea' })
  const sound = await ui.find({ key: 'sound' })
  expect(sound?.props.label).toBe('🎸')
  expect((sound?.props.options as { value: string; label: string }[]).map(o => o.label)).toEqual(['Plettro', 'Dita'])
  expect(sound?.props.value).toBe('plettro')

  // Dita and Avanzato together, while it plays: their own file.
  await ui.press({ key: 'sing' })
  await clock.advance(1300)
  await ui.select({ key: 'sound', value: 'dita' })
  await clock.advance(200)
  await ui.select({ key: 'voice', value: 'avanzato' })
  await clock.advance(200)
  expect(played).toEqual(['audio/odissea.m4a', 'audio/odissea-dita.m4a', 'audio/odissea-dita-avanzato.m4a'])
  expect(memory.sounds).toEqual({ odissea: 'dita' })

  // Back in the band, the Serenata: nothing to set, no menus.
  await ui.select({ key: 'collection', value: 'band' })
  expect(await ui.find({ key: 'sound' })).toBeUndefined()
  expect(await ui.find({ key: 'voice' })).toBeUndefined()
  await ui.unmount()
})

test('the rocket flies over the band and lands on the board', () => {
  const song = SONGS.find(s => s.scenery === 'codice')!
  const f = flight(song)
  const first = f.points[0]!
  const last = f.points[f.points.length - 1]!
  // From the screen to the board, waving once every two beats of its flight.
  expect(first).toEqual({ x: 430, y: 152.6 })
  expect(near(last.x, 1014) && near(last.y, 59)).toBe(true)
  expect(f.waves).toBe(Math.round(f.dur / (2 * song.beat)))
  // Over the singer's head (its top at 134) and the drummer's (72, on the riser).
  for (const p of f.points) {
    if (p.x >= 490 && p.x <= 590) expect(p.y).toBeLessThan(124)
    if (p.x >= 665 && p.x <= 735) expect(p.y).toBeLessThan(66)
  }
  // It takes off after the check and hits the board as the closing words light up.
  expect(f.start).toBeGreaterThan(song.finaleAt)
  expect(near(f.start + f.dur, song.outroAt)).toBe(true)
  // The stage still fits, and the rocket is on it; the Serenata has none.
  const stage = band(1, song)
  expect(stage).toContain('<animateMotion')
  expect(stage).toContain('pointer-events="none"')
  expect(band(1, SONGS[0]!)).not.toContain('<animateMotion')
})

test('the band offers the profiles and styles the tools render, in the same order', () => {
  expect(SOUND_PROFILES.map(p => p.id)).toEqual(Object.keys(PROFILES))
  expect(VOICE_STYLES.map(s => s.id)).toEqual(STYLES)
})

// Records each clip played and whether it was stopped, as the host's player would see it.
function player(on: On) {
  const plays: { asset: string; signal: AbortSignal }[] = []
  // Each clip plays until it is stopped, as a real one does until its end.
  on('audio.play', (_, e, next) => {
    plays.push({ asset: String(e.clip.asset), signal: next.signal })

    return new Promise(resolve => next.signal.addEventListener('abort', () => resolve({ value: undefined })))
  })

  return plays
}

test('a song that ends by itself leaves the band quiet: picking a song then plays nothing', async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  mock.store(on)
  const plays = player(on)
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await ui.select({ key: 'collection', value: 'band' })
  await ui.press({ key: 'sing' })
  await clock.advance(1300)
  expect(plays).toHaveLength(1)

  // The Serenata lasts 54 s: after it the stage keeps its last frame, and a pick plays nothing.
  await clock.advance(55_000)
  expect(await songOnStage(ui)).toBe('serenata')
  await ui.select({ key: 'song', value: 'canzone-2' })
  await clock.advance(2000)
  expect(plays).toHaveLength(1)
  await ui.unmount()

  // The terminal shows the quiet row again, with Canta.
  const row = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await row.find({ key: 'sing' })).toBeDefined()
  expect(await row.find({ key: 'stop' })).toBeUndefined()
  await row.unmount()
})

test('Stop and Ancora stop the clip that was playing', async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  const plays = player(on)
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await ui.press({ key: 'sing' })
  await clock.advance(1300)
  await ui.press({ key: 'sing' })
  await clock.advance(200)
  expect(plays.map(p => p.signal.aborted)).toEqual([true, false])
  await ui.press({ key: 'stop' })
  expect(plays.map(p => p.signal.aborted)).toEqual([true, true])
  await ui.unmount()
})

test('two starts at once play one song', async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  mock.store(on)
  const plays = player(on)
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })

  await Promise.all([ui.press({ key: 'sing' }), $.command.run(typed('canta'))])
  await clock.advance(2500)
  expect(plays.filter(p => !p.signal.aborted)).toHaveLength(1)
  expect(plays).toHaveLength(1)
  await ui.unmount()
})

test('/canta and /serenata off at once: either wins, but no music plays with the band hidden', async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  mock.store(on)
  const plays = player(on)
  await Promise.all([$.command.run(typed('canta')), $.command.run(typed('serenata', 'off'))])
  await clock.advance(2500)
  const isShown = (await $.command.run(typed('serenata'))).text?.includes('accesa')
  const sounding = plays.filter(p => !p.signal.aborted)
  if (isShown) expect(sounding).toHaveLength(1)
  else expect(sounding).toHaveLength(0)
  // And Stop is always reachable when something sounds: hiding the band stops it.
  await $.command.run(typed('serenata', 'off'))
  expect(plays.filter(p => !p.signal.aborted)).toHaveLength(0)
})

test('a session restores the sound of each song, the last song of each collection and a hidden band', async ($, on) => {
  mock.clock(on)
  storeIn(on, { songId: 'serenata', sounds: { odissea: 'dita', serenata: 7 }, lastSongs: { odissea: 'dipende-da-me' }, showSettings: true })
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('command.register', (_, e) => ({ value: { command: e.name } }))
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await ui.select({ key: 'collection', value: 'odissea' })
  expect((await ui.find({ key: 'song' }))?.props.value).toBe('dipende-da-me')
  await ui.select({ key: 'song', value: 'odissea' })
  expect((await ui.find({ key: 'sound' }))?.props.value).toBe('dita')
  await ui.unmount()
})

test('a band hidden in an earlier session stays hidden', async ($, on) => {
  mock.clock(on)
  storeIn(on, { isShown: false })
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('command.register', (_, e) => ({ value: { command: e.name } }))
  // Nothing draws beneath the mod in a test: this hook stands for the engine.
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>engine</Text>
  })
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await ui.find({ key: 'sing' })).toBeUndefined()
  await ui.unmount()
})

test('each album plays in its own ambience: the band in its club, HANA in a data center, Odissea in a temple, MDO on an evening of its own, Carica at a rave', () => {
  const stageOf = (id: string) => band(1, SONGS.find(song => song.id === id)!)
  const expected = { band: 'club', hana: 'datacenter', odissea: 'antico', mdo: 'serata', carica: 'rave' } as const
  for (const song of SONGS) expect(ambienceOf(song)).toBe(expected[song.collection])
  // The data center: its wall, teal beams, headsets; the band's own instruments.
  const hana = stageOf('hana-di-notte')
  expect(hana).toContain('url(#datacenterWall)')
  expect(hana).toContain('url(#datacenterBeamTeal)')
  expect(hana).not.toContain('url(#beamPurple)')
  expect(hana).not.toContain('anticoWall')
  expect(hana.length).toBeLessThan(131072)
  // Its riser is grey-blue steel; the club keeps its purple one.
  expect(hana).toContain('fill="#252e3e"')
  expect(stageOf('serenata')).toContain('fill="#2e1f45"')
  // MDO's evening: wine walls, rose beams, flower crowns, a riser in the walls' wine.
  // In principio builds up its own way: bass at bar 6, a heartbeat from bar 8;
  // so does Centottanta: the kick from the first bar, the acid line at bar 2;
  // every other song keeps the fixed form, and the stage follows each.
  const principio = SONGS.find(s => s.id === 'in-principio')!
  expect([principio.bassAt, principio.drumsAt]).toEqual([+(6 * principio.bar).toFixed(3), +(8 * principio.bar).toFixed(3)])
  const centottanta = SONGS.find(s => s.id === 'centottanta')!
  expect([centottanta.bassAt, centottanta.drumsAt]).toEqual([+(2 * centottanta.bar).toFixed(3), 0])
  for (const song of SONGS.filter(s => s.id !== 'in-principio' && s.collection !== 'carica')) expect([song.bassAt, song.drumsAt]).toEqual([undefined, undefined])
  const mdo = stageOf('in-principio')
  expect(mdo).toContain(`begin="${(principio.drumsAt ?? 0).toFixed(2)}s"`)
  expect(mdo).toContain('url(#serataWall)')
  expect(mdo).toContain('url(#serataBeamRose)')
  expect(mdo).toContain('fill="#3a1426"')
  expect(mdo).not.toContain('url(#beamPurple)')
  expect(mdo.length).toBeLessThan(131072)
  // The rave: its wall and green beams, dark glasses on the Claudes, a riser
  // with a neon edge, and a crowd in front that takes no taps.
  const rave = stageOf('centottanta')
  expect(rave).toContain('url(#raveWall)')
  expect(rave).toContain('url(#raveBeamGreen)')
  expect(rave).toContain('fill="#9ffcff"')
  expect(rave).toContain('fill="#14121c"')
  expect(rave).not.toContain('url(#beamPurple)')
  expect(rave.length).toBeLessThan(131072)
  // The club is drawn as it always was: its beams, its string of lights, its keyboard.
  for (const id of ['serenata', 'canzone-2', 'canzone-3']) {
    expect(stageOf(id)).toContain('url(#beamPurple)')
    expect(stageOf(id)).not.toContain('anticoWall')
  }
  // The temple: its wall and frieze, golden beams, laurel on the Claudes.
  for (const id of ['odissea', 'dipende-da-me', 'so-di-non-sapere', 'un-altro-me-stesso']) {
    const stage = stageOf(id)
    expect(stage).toContain('url(#anticoWall)')
    expect(stage).toContain('url(#anticoKey)')
    expect(stage).toContain('url(#anticoBeamGold)')
    expect(stage).not.toContain('url(#beamPurple)')
    expect(stage).toContain('#6f9a3f')
    expect(stage.length).toBeLessThan(131072)
  }
})

test('Centottanta is played in double time: the band and the stage move on every kick, twice a beat', () => {
  const song = SONGS.find(s => s.id === 'centottanta')!
  // Written at 90, played at 180: the form keeps its beat, the band plays half of it.
  expect(song.bpm).toBe(90)
  expect(near(song.pulse ?? 0, song.beat / 2)).toBe(true)
  // Every song of Carica is played in double time, and no other.
  for (const other of SONGS) expect(other.pulse === undefined).toBe(other.collection !== 'carica')
  // Played by the rave band only, in the one voice its words need: nothing to set.
  expect(soundsOf(song)).toEqual(['rave'])
  expect(voicesOf(song, 'rave')).toEqual(['classico'])
  expect(hasSettings(song, 'rave')).toBe(false)
  const stage = band(1, song)
  const pulse = (song.pulse ?? 0).toFixed(2)
  // The singer hops on every kick from the acid line on, and the drum's head on every kick from the first.
  expect(stage).toContain(`dur="${pulse}s" begin="${(song.bassAt ?? 0).toFixed(2)}s"`)
  expect(stage).toContain(`keyTimes="0;0.15;0.5;0.5;0.65;1" dur="${(2 * (song.pulse ?? 0)).toFixed(2)}s" begin="0.00s"`)
  // The battery charges to 100% at the first drop, 200% in the last; the
  // speakers pump while the kick plays, out in the breaks.
  expect(stage).toContain('180 BPM')
  expect(stage).toContain('>100%<')
  expect(stage).toContain('>200%<')
  const kick = sectionsOf(song)
    .filter(s => s.part !== 'break' && s.part !== 'outro')
    .reduce<[number, number][]>((spans, s) => {
      const last = spans.at(-1)
      if (last && near(last[1], s.start)) last[1] = s.end
      else spans.push([s.start, s.end])
      return spans
    }, [])
  expect(kick).toHaveLength(3)
  expect(stage).toContain(`begin="${kick.map(([b]) => b.toFixed(2) + 's').join(';')}" end="${kick.map(([, e]) => e.toFixed(2) + 's').join(';')}"`)
  // POM! pops on each «pom» the voice sings.
  const poms = song.lines.flatMap(line => line.syls.filter(s => /^pom/i.test(s.text)))
  expect(poms).toHaveLength(15)
  for (const pom of poms) expect(stage).toContain(`${pom.start.toFixed(2)}s`)
})

test('Centottanta has a form of its own: two verses, a roll and a breakdown, three drops, about a minute and a half', () => {
  const song = SONGS.find(s => s.id === 'centottanta')!
  expect(sectionsOf(song).map(s => s.part)).toEqual(['intro', 'verse', 'break', 'drop', 'verse', 'break', 'drop', 'drop', 'outro'])
  expect(song.lines).toHaveLength(14)
  expect(song.duration).toBeGreaterThan(85)
  // The stage crashes where each drop starts and on the last bar of the last;
  // the lasers light in each drop and go out in between, the last two drops,
  // one after the other, lit as one.
  const drops = partsOf(song, 'drop')
  const stage = band(1, song)
  expect(stage).toContain(`begin="${[...drops.map(d => d.start), drops[2]!.end - song.bar].map(t => t.toFixed(2) + 's').join(';')}"`)
  expect(stage).toContain(`to="0.6" begin="${[drops[0]!.start, drops[1]!.start].map(t => t.toFixed(2) + 's').join(';')}"`)
  expect(stage).toContain(`to="0" begin="${[drops[0]!.end, song.outroAt + 1].map(t => t.toFixed(2) + 's').join(';')}"`)
  // The last drop is the biggest: the battery shakes, the cones and the crowd
  // move twice as far, from its start to its end.
  const last = drops[2]!
  expect(stage).toContain(`values="0 0;-1.6 0.6;1.6 -0.6;0 0" dur="${(song.pulse ?? 0).toFixed(2)}s" begin="${last.start.toFixed(2)}s"`)
  expect(stage).toContain(`values="1.24;1;1" keyTimes="0;0.4;1" dur="${(song.pulse ?? 0).toFixed(2)}s" begin="${last.start.toFixed(2)}s" end="${last.end.toFixed(2)}s"`)
  // Every song but Carica's keeps the first form, as it always had.
  for (const other of SONGS) expect(other.sections === undefined).toBe(other.collection !== 'carica')
})

test('Carica has four songs: Centottanta, Cutover at 190, Venerdì played happy, and Fable 5.2', () => {
  expect(songsIn('carica').map(s => s.id)).toEqual(['centottanta', 'cutover', 'venerdi', 'fable'])
  const cutover = SONGS.find(s => s.id === 'cutover')!
  const venerdi = SONGS.find(s => s.id === 'venerdi')!
  expect(Math.round(60 / (cutover.pulse ?? 1))).toBe(190)
  // Each in one sound and in the advanced voice only, which sings their v, b, g and z: nothing to set.
  expect(soundsOf(cutover)).toEqual(['rave'])
  expect(soundsOf(venerdi)).toEqual(['happy'])
  for (const song of [cutover, venerdi]) {
    expect(voicesOf(song, soundOf(song, undefined))).toEqual(['avanzato'])
    expect(hasSettings(song, soundOf(song, undefined))).toBe(false)
    expect(song.duration).toBeGreaterThan(75)
  }
  // Cutover: the import fails in the breaks and goes green in the drops, live in the last.
  const night = band(1, cutover)
  expect(night).toContain('>RC 8<')
  expect(night).toContain('>RC 0 ✓<')
  expect(night).toContain('>LIVE ✓<')
  expect(night).toContain(`values="-32 300 470;38 300 470" dur="0.25s" begin="${partsOf(cutover, 'drop')[0]!.start.toFixed(2)}s"`)
  // Venerdì: the clock strikes six at the first drop, then the weekend.
  const friday = band(1, venerdi)
  expect(friday).toContain('>17:58<')
  expect(friday).toContain('>18:00<')
  expect(friday).toContain('>WEEKEND!<')
  // It explodes at its end: a last drop twice as long as the first, under confetti.
  const [first, ...rest] = partsOf(venerdi, 'drop')
  const last = rest.at(-1)!
  expect(Math.abs(last.end - last.start - 2 * (first!.end - first!.start))).toBeLessThan(0.05)
  expect(friday.match(/values="6;1;6"/g)?.length).toBe(36)
  expect(friday).toContain(`begin="${last.start.toFixed(2)}s" fill="freeze"/>`)
  for (const stage of [night, friday]) expect(stage.length).toBeLessThan(131072)
})

test('Fable 5.2 is what a new install starts on, at 200, the band dancing in its drops', () => {
  const fable = songOf(null)
  expect(fable.id).toBe('fable')
  expect(songOf('una-canzone-tolta').id).toBe('fable')
  expect(Math.round(60 / (fable.pulse ?? 1))).toBe(200)
  expect(soundsOf(fable)).toEqual(['rave'])
  expect(voicesOf(fable, 'rave')).toEqual(['avanzato'])
  const stage = band(1, fable)
  expect(stage.length).toBeLessThan(131072)
  // The book closed until the first drop, the version from 5.1 to 5.2.
  const first = partsOf(fable, 'drop')[0]!
  expect(stage).toContain('>5.1<')
  expect(stage).toContain('>5.2<')
  expect(stage).toContain(`<set attributeName="visibility" to="hidden" begin="${first.start.toFixed(2)}s" fill="freeze"/>`)
  // Four Claudes jump in the drops and wiggle in the last; in no other song.
  const last = partsOf(fable, 'drop').at(-1)!
  expect(stage.match(/values="0 0;-0.5 -1.5;0 0;0.5 -1.5"/g)?.length).toBe(4)
  expect(stage.match(new RegExp(`values="-8 4 8;8 4 8" dur="[0-9.]+s" begin="${last.start.toFixed(2)}s"`, 'g'))?.length).toBe(4)
  for (const other of SONGS.filter(s => s.id !== 'fable')) expect(band(1, other)).not.toContain('-0.5 -1.5')
})
