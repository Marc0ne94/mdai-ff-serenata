import { AUDIO as CENTOTTANTA_AUDIO, TIMING as CENTOTTANTA_TIMING } from './songs/centottanta'
import { AUDIO as CUTOVER_AUDIO, TIMING as CUTOVER_TIMING } from './songs/cutover'
import { AUDIO as DIPENDE_DA_ME_AUDIO, TIMING as DIPENDE_DA_ME_TIMING } from './songs/dipende-da-me'
import { AUDIO as GO_LIVE_AUDIO, TIMING as GO_LIVE_TIMING } from './songs/go-live'
import { AUDIO as HANA_DI_NOTTE_AUDIO, TIMING as HANA_DI_NOTTE_TIMING } from './songs/hana-di-notte'
import { AUDIO as IN_PRINCIPIO_AUDIO, TIMING as IN_PRINCIPIO_TIMING } from './songs/in-principio'
import { AUDIO as ODISSEA_AUDIO, TIMING as ODISSEA_TIMING } from './songs/odissea'
import { AUDIO as SERENATA_AUDIO, TIMING as SERENATA_TIMING } from './songs/serenata'
import { AUDIO as SO_DI_NON_SAPERE_AUDIO, TIMING as SO_DI_NON_SAPERE_TIMING } from './songs/so-di-non-sapere'
import { AUDIO as TUTTO_PRONTO_AUDIO, TIMING as TUTTO_PRONTO_TIMING } from './songs/tutto-pronto'
import { AUDIO as UN_ALTRO_ME_STESSO_AUDIO, TIMING as UN_ALTRO_ME_STESSO_TIMING } from './songs/un-altro-me-stesso'
import { AUDIO as VENERDI_AUDIO, TIMING as VENERDI_TIMING } from './songs/venerdi'

// The songs the band can play. Each one is a file of tools/songs, rendered by
// tools/render.mjs into the audio of each pair of sound profile and voice style
// it declares (audio/) and its timing (hooks/songs/): seconds from the start of
// the clip, which the stage follows, the same in every pair.
export type Syllable = { text: string; start: number; end: number; open: number }
// The parts of a song's form, and its sections in seconds (see tools/synth.mjs).
export type Part = 'intro' | 'verse' | 'break' | 'drop' | 'outro'
export type Section = { part: Part; start: number; end: number }
export type Line = { start: number; end: number; syls: Syllable[] }
export type Timing = {
  bpm: number
  beat: number
  // The beat the band plays and the stage moves to, for a song in double time
  // (half a beat); absent, the beat.
  pulse?: number
  bar: number
  duration: number
  outroAt: number
  bloomAt: number
  finaleAt: number
  // When the bass and the drums enter, for a song that builds up its own way;
  // absent, the fixed form (bars 2 and 6).
  bassAt?: number
  drumsAt?: number
  // The sections of a song with a form of its own; absent, the first form
  // (see sectionsOf).
  sections?: Section[]
  lines: Line[]
}

// A song's sections: its own, or the first form's, 16 bars: intro 2, verse 8,
// drop 4 (the finale), outro 2.
export function sectionsOf(song: Timing): Section[] {
  if (song.sections) return song.sections
  const { bar, outroAt } = song
  return [
    { part: 'intro', start: 0, end: 2 * bar },
    { part: 'verse', start: 2 * bar, end: 10 * bar },
    { part: 'drop', start: 10 * bar, end: outroAt },
    { part: 'outro', start: outroAt, end: 16 * bar },
  ]
}

// The sections of one part, in order.
export const partsOf = (song: Timing, part: Part) => sectionsOf(song).filter(s => s.part === part)

// The technical side of a song, picked per song in the band's settings: how it
// is played (its sound profile, defined in tools/synth.mjs) and how it is sung
// (its voice style). A song is rendered in the pairs its file in tools/songs
// declares, and in no other: the menus offer exactly those, in this order.
export type VoiceId = 'classico' | 'avanzato'
export type SoundId = 'pop' | 'plettro' | 'dita' | 'rave' | 'happy'
export type Voices = Partial<Record<VoiceId, string>>
export type Sounds = Partial<Record<SoundId, Voices>>
export const VOICE_STYLES: readonly { id: VoiceId; label: string }[] = [
  { id: 'classico', label: 'Classico' },
  { id: 'avanzato', label: 'Avanzato' },
]
export const SOUND_PROFILES: readonly { id: SoundId; label: string }[] = [
  { id: 'pop', label: 'Band' },
  { id: 'plettro', label: 'Plettro' },
  { id: 'dita', label: 'Dita' },
  { id: 'rave', label: 'Rave' },
  { id: 'happy', label: 'Happy' },
]

// The collections (albums) the songs are gathered in, in the menu's order: the
// band's own songs, played in its club; HANA, songs of the SAP world, played in
// a data center; Odissea, songs of the ancient world and of its philosophers,
// played in a temple; MDO, the Serenata's own love story, played on an
// evening of its own; and Carica, songs that give a charge, played at a rave.
// The ambiences are in hooks/ambiences.
export type CollectionId = 'band' | 'hana' | 'odissea' | 'mdo' | 'carica'
export type AmbienceId = 'club' | 'datacenter' | 'antico' | 'serata' | 'rave'
export const COLLECTIONS: readonly { id: CollectionId; label: string; ambience: AmbienceId }[] = [
  { id: 'band', label: 'La band', ambience: 'club' },
  { id: 'hana', label: 'HANA', ambience: 'datacenter' },
  { id: 'odissea', label: 'Odissea', ambience: 'antico' },
  { id: 'mdo', label: 'MDO', ambience: 'serata' },
  { id: 'carica', label: 'Carica', ambience: 'rave' },
]

// The sceneries of hooks/sets, by name.
export type SceneryId = 'rosa' | 'codice' | 'golive' | 'tempio' | 'stoa' | 'hana' | 'delfi' | 'liceo' | 'principio' | 'batteria' | 'cutover' | 'venerdi'

export type Song = Timing & {
  // Its address in the menus, in /canta and in the store: short, never reused.
  id: string
  // What the menu shows.
  title: string
  collection: CollectionId
  // What stands on the stage around the band while it plays.
  scenery: SceneryId
  // Its sound profiles, and the voice styles of each with its audio file.
  audio: Sounds
  // Where its words come from, when they follow a text: author, work, passage.
  source?: string
}

// The first song, written for the mod.
const SERENATA: Song = { id: 'serenata', title: 'Serenata', collection: 'band', scenery: 'rosa', audio: SERENATA_AUDIO, ...SERENATA_TIMING }

export const SONGS: readonly Song[] = [
  SERENATA,
  { id: 'canzone-2', title: 'Tutto pronto', collection: 'band', scenery: 'codice', audio: TUTTO_PRONTO_AUDIO, ...TUTTO_PRONTO_TIMING },
  // Its id is the placeholder's that held its place: whoever picked that one finds this.
  { id: 'canzone-3', title: 'Go-live', collection: 'band', scenery: 'golive', audio: GO_LIVE_AUDIO, ...GO_LIVE_TIMING },
  { id: 'hana-di-notte', title: 'HANA di notte', collection: 'hana', scenery: 'hana', audio: HANA_DI_NOTTE_AUDIO, ...HANA_DI_NOTTE_TIMING },
  {
    id: 'odissea',
    title: 'Odissea',
    collection: 'odissea',
    scenery: 'tempio',
    audio: ODISSEA_AUDIO,
    source: "Omaggio a Omero: il «mare color del vino» è un suo epiteto, l'invocazione alla Musa apre l'Odissea (I, 1)",
    ...ODISSEA_TIMING,
  },
  {
    id: 'dipende-da-me',
    title: 'Dipende da me',
    collection: 'odissea',
    scenery: 'stoa',
    audio: DIPENDE_DA_ME_AUDIO,
    source: 'Epitteto, Manuale (Enchiridion), capitolo 1',
    ...DIPENDE_DA_ME_TIMING,
  },
  {
    id: 'so-di-non-sapere',
    title: 'So di non sapere',
    collection: 'odissea',
    scenery: 'delfi',
    audio: SO_DI_NON_SAPERE_AUDIO,
    source: 'Platone, Apologia di Socrate 21a–d (il titolo è la sintesi tradizionale, non le parole di Platone)',
    ...SO_DI_NON_SAPERE_TIMING,
  },
  {
    id: 'un-altro-me-stesso',
    title: 'Un altro me stesso',
    collection: 'odissea',
    scenery: 'liceo',
    audio: UN_ALTRO_ME_STESSO_AUDIO,
    source: 'Aristotele, Etica Nicomachea VIII 1 (1155a) e IX 4 (1166a)',
    ...UN_ALTRO_ME_STESSO_TIMING,
  },
  // The Serenata's sequel, the first of its own album: three acronyms, spelled
  // out, that belong to it.
  { id: 'in-principio', title: 'In principio fu il MAV', collection: 'mdo', scenery: 'principio', audio: IN_PRINCIPIO_AUDIO, ...IN_PRINCIPIO_TIMING },
  // The first song of Carica: hardcore techno, the kick on every beat at 180.
  { id: 'centottanta', title: 'Centottanta', collection: 'carica', scenery: 'batteria', audio: CENTOTTANTA_AUDIO, ...CENTOTTANTA_TIMING },
  // The night a system goes live, at 190; and Friday at six, happy hardcore.
  { id: 'cutover', title: 'Cutover', collection: 'carica', scenery: 'cutover', audio: CUTOVER_AUDIO, ...CUTOVER_TIMING },
  { id: 'venerdi', title: 'Venerdì', collection: 'carica', scenery: 'venerdi', audio: VENERDI_AUDIO, ...VENERDI_TIMING },
]

// The song with this id, or the first one when no song has it any more.
export function songOf(id: string | null | undefined): Song {
  return SONGS.find(song => song.id === id) ?? SERENATA
}

// The ambience a song is played in: its collection's.
export function ambienceOf(song: Song): AmbienceId {
  return COLLECTIONS.find(c => c.id === song.collection)?.ambience ?? 'club'
}

// The songs of a collection, in the order of SONGS.
export function songsIn(collection: CollectionId): Song[] {
  return SONGS.filter(song => song.collection === collection)
}

// The collections that hold at least one song.
export function collectionsInUse(): CollectionId[] {
  return COLLECTIONS.map(c => c.id).filter(id => songsIn(id).length > 0)
}

// The sound profiles a song is played in, in the menu's order.
export function soundsOf(song: Song): SoundId[] {
  return SOUND_PROFILES.map(p => p.id).filter(id => song.audio[id] !== undefined)
}

// The profile a song is played in: the one picked for it, while the song has
// it, else its first.
export function soundOf(song: Song, picked: string | undefined): SoundId {
  const sounds = soundsOf(song)
  return sounds.find(id => id === picked) ?? sounds[0] ?? 'pop'
}

// The voice styles a song is sung in, in one of its profiles, in the menu's order.
export function voicesOf(song: Song, sound: SoundId): VoiceId[] {
  const voices = song.audio[sound] ?? {}
  return VOICE_STYLES.map(style => style.id).filter(id => voices[id] !== undefined)
}

// The style a song is sung in, in a profile: the one picked for it, while that
// profile has it, else the profile's first.
export function voiceOf(song: Song, sound: SoundId, picked: string | undefined): VoiceId {
  const styles = voicesOf(song, sound)
  return styles.find(id => id === picked) ?? styles[0] ?? 'classico'
}

// The audio of a song in a profile and a style, or its first audio of all.
export function assetOf(song: Song, sound: SoundId, voice: VoiceId): string {
  return song.audio[sound]?.[voice] ?? Object.values(song.audio).flatMap(v => Object.values(v ?? {}))[0] ?? ''
}

// Whether a song has anything to set: more than one profile, or more than one
// style in the profile it is played in.
export function hasSettings(song: Song, sound: SoundId): boolean {
  return soundsOf(song).length > 1 || voicesOf(song, sound).length > 1
}
