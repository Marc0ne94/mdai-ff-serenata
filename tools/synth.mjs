// The engine of the "serenata" mod's songs: renders a song file of tools/songs
// with a voice built from scratch with formant synthesis (no system voice),
// played by a band of its orchestra (see ORCHESTRA). Writes the audio and the timing the drawing follows.
// A song's form is a run of sections (`form`, [part, bars]): an intro, verses,
// breaks (the band drops back before a drop), drops (the finale, or each
// chorus at full band) and an outro; its lines, two bars each, are sung
// anywhere between the intro and the outro. The stage in hooks/scene.ts
// follows the sections. A song that declares no form has the first one, 16
// bars: intro (bars 0-1), verse 2-9, drop 10-13, outro 14-15, and six lines
// from bar 2, one every two bars; bass from bar 2, drums and pad from bar 6.
// What a song chooses besides: its tempo, chords, melody and words, and the
// seed of its noise; a song may also build up its own way (`build`: when bass,
// pad and drums enter), and be played in double time (`doubleTime`): its form
// written at its tempo, the band playing at twice it, as a rave does (90
// written, 180 played); and, played happy, turn hard from a bar on
// (`hardFrom`, see raveBand).
// The voice comes in styles: `classico`, the first voice, which sings the
// letters it knows and skips b, g, v and z; `avanzato`, the same voice that
// also sings those. Every style follows the same notes, so the timing is one.
// The band plays in a sound profile (see PROFILES): an orchestra and how its
// instruments are played. A song declares the profiles and voice styles it is
// rendered in, each with its audio file, in `audio`.
// Usage: node synth.mjs <song.mjs> <out.wav> <out.json> [voice] [profile]
// tools/render.mjs runs it for every profile and style a song declares.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { PROFILES, STYLES } from './profiles.mjs'

const [, , SONG_FILE, OUT_WAV, OUT_JSON, VOICE = 'classico', PROFILE_ARG] = process.argv
if (!STYLES.includes(VOICE)) throw new Error(`no voice style ${VOICE}: ${STYLES.join(' or ')}`)
const ADVANCED = VOICE === 'avanzato'
const SONG = (await import(pathToFileURL(path.resolve(SONG_FILE)).href)).default
// The sound profiles are defined in tools/profiles.mjs; a song picks among them.
if (!SONG.audio || Object.keys(SONG.audio).length === 0) throw new Error('a song declares its sound profiles and voices in `audio`')
for (const name of Object.keys(SONG.audio)) if (!(name in PROFILES)) throw new Error(`no sound profile ${name}: ${Object.keys(PROFILES).join(', ')}`)
const PROFILE = PROFILE_ARG ?? Object.keys(SONG.audio)[0]
if (!(PROFILE in SONG.audio)) throw new Error(`the song is not played in the profile ${PROFILE}`)
const { orchestra: ORCHESTRA, lyre: LYRE, mood: MOOD } = PROFILES[PROFILE]

const BPM = SONG.bpm
const BEAT = 60 / BPM
const BAR = 4 * BEAT
if (SONG.doubleTime !== undefined && typeof SONG.doubleTime !== 'boolean') throw new Error(`doubleTime is true or false, not ${JSON.stringify(SONG.doubleTime)}`)
// The beat the band plays: the form's, or half of it in double time.
const PULSE = SONG.doubleTime ? BEAT / 2 : BEAT
const SR = 44100
const VSR = 22050

const CHORD = SONG.chords
const BARS = SONG.bars
const LINES = SONG.lines
// Numbers the engine computes with: a missing or wrong one would render silence.
const isNumber = x => typeof x === 'number' && Number.isFinite(x)

// ---------- the form ----------
const PARTS = ['intro', 'verse', 'break', 'drop', 'outro']
const FORM = SONG.form ?? [['intro', 2], ['verse', 8], ['drop', 4], ['outro', 2]]
if (!Array.isArray(FORM) || FORM.length < 3) throw new Error(`a form is a list of at least an intro, a drop and an outro: ${JSON.stringify(SONG.form)}`)
const SECTIONS = []
for (const section of FORM) {
  const [part, bars] = Array.isArray(section) ? section : []
  if (!PARTS.includes(part)) throw new Error(`form: no part ${JSON.stringify(part)} (${PARTS.join(', ')})`)
  if (!Number.isInteger(bars) || bars < 1) throw new Error(`form: ${part} lasts a whole number of bars, not ${JSON.stringify(bars)}`)
  const from = SECTIONS.length ? SECTIONS[SECTIONS.length - 1].to : 0
  SECTIONS.push({ part, from, to: from + bars })
}
if (SECTIONS[0].part !== 'intro' || SECTIONS.slice(1).some(s => s.part === 'intro')) throw new Error('form: an intro starts it, and only there')
if (SECTIONS[SECTIONS.length - 1].part !== 'outro' || SECTIONS.slice(0, -1).some(s => s.part === 'outro')) throw new Error('form: an outro ends it, and only there')
if (!SECTIONS.some(s => s.part === 'drop')) throw new Error('form: at least one drop, the finale')
const FORM_BARS = SECTIONS[SECTIONS.length - 1].to
if (BARS.length !== FORM_BARS) throw new Error(`the form has ${FORM_BARS} bars, the chords ${BARS.length}`)
const INTRO_BARS = SECTIONS[0].to
const OUTRO_BAR = SECTIONS[SECTIONS.length - 1].from
const DROPS = SECTIONS.filter(s => s.part === 'drop')
const partOf = bar => SECTIONS.find(s => bar >= s.from && bar < s.to)?.part
const isDrop = bar => partOf(bar) === 'drop'
// The bars a crash marks: where each drop starts, and the last bar of the last.
const CRASH_BARS = [...DROPS.map(s => s.from), DROPS[DROPS.length - 1].to - 1]
const isDropAt = t => DROPS.some(s => t >= s.from * BAR && t < s.to * BAR)
// The bar a happy band turns hard from (see raveBand): between the intro and
// the outro, in a song played happy in one of its profiles.
if (SONG.hardFrom !== undefined) {
  if (!Number.isInteger(SONG.hardFrom) || SONG.hardFrom < INTRO_BARS || SONG.hardFrom >= OUTRO_BAR) throw new Error(`hardFrom is a bar between the intro and the outro, not ${JSON.stringify(SONG.hardFrom)}`)
  if (!Object.keys(SONG.audio).some(name => PROFILES[name].mood === 'happy')) throw new Error('hardFrom turns a happy band hard: the song is played happy in none of its profiles')
}
for (const [name, chord] of Object.entries(CHORD)) {
  const [root, intervals] = Array.isArray(chord) ? chord : []
  if (!isNumber(root) || !Array.isArray(intervals) || intervals.length < 3 || !intervals.every(isNumber)) {
    throw new Error(`chord ${name} is [bass root, [at least 3 intervals]], all numbers: ${JSON.stringify(chord)}`)
  }
}
for (const tune of [SONG.reed?.intro ?? [], SONG.reed?.outro ?? []]) {
  for (const note of tune) if (!Array.isArray(note) || !isNumber(note[0]) || !isNumber(note[1]) || note[1] <= 0) throw new Error(`a reed note is [midi, beats]: ${JSON.stringify(note)}`)
}
if (!(SONG.drone ?? []).every(isNumber)) throw new Error(`the drone is a list of midi numbers: ${JSON.stringify(SONG.drone)}`)
// The pair asked for is one the song declares.
if (!(VOICE in (SONG.audio[PROFILE] ?? {}))) throw new Error(`the song is not sung in ${VOICE} in the profile ${PROFILE}`)
for (const bar of BARS) {
  const beats = bar.reduce((sum, [name, n]) => {
    if (!(name in CHORD)) throw new Error(`unknown chord ${name}`)
    return sum + n
  }, 0)
  if (beats !== 4) throw new Error(`a bar has 4 beats, not ${beats}: ${JSON.stringify(bar)}`)
}
// The voice knows these letters only (see phonemes): any other would be sung as nothing.
// An i held on a high note (above about G4, midi 67) comes out thin, and the
// level that evens the vowels out then lifts its consonant into a spike that
// sinks the whole voice: check loudestSyllables in the output after a render.
const SINGABLE = /^[acdefhiklmnopqrstu]+$/
// What the advanced style sings besides; anything else no style sings.
const ADVANCED_SINGABLE = /^[abcdefghiklmnopqrstuvz]+$/
// The syllables the classic style sings without one of their letters.
const lostInClassico = []
// The lines: the first form's six one every two bars from bar 2; a declared
// form's in order, none over another, between the intro and the outro, at
// least one before the first drop and one in it.
if (!SONG.form && LINES.length !== 6) throw new Error(`a song has 6 lines, not ${LINES.length}`)
LINES.forEach((line, i) => {
  if (!SONG.form && line.bar !== 2 + 2 * i) throw new Error(`line ${i + 1} starts at bar ${2 + 2 * i}, not ${line.bar}`)
  if (!Number.isInteger(line.bar) || line.bar < INTRO_BARS || line.bar + 2 > OUTRO_BAR) throw new Error(`line ${i + 1} starts at bar ${line.bar}, not between the intro and the outro`)
  if (i > 0 && line.bar < LINES[i - 1].bar + 2) throw new Error(`line ${i + 1} starts at bar ${line.bar}, over line ${i}`)
  let beats = 0
  let sung = 0
  for (const [text, sing, midi, length] of line.syl) {
    const lengths = Array.isArray(length) ? length : [length]
    if (!lengths.every(n => isNumber(n) && n > 0)) throw new Error(`line ${i + 1}: "${text}" lasts ${JSON.stringify(length)} beats, not a positive number`)
    beats += lengths.reduce((sum, n) => sum + n, 0)
    if (sing === null) continue
    sung++
    if (!ADVANCED_SINGABLE.test(sing)) throw new Error(`line ${i + 1}: "${sing}" (${text}) has a letter no voice can sing`)
    if (!/[aeiou]/.test(sing)) throw new Error(`line ${i + 1}: "${sing}" (${text}) has no vowel to hold the note`)
    if (!(Array.isArray(midi) ? midi : [midi]).every(isNumber)) throw new Error(`line ${i + 1}: "${text}" has a note that is not a number: ${JSON.stringify(midi)}`)
    if (!SINGABLE.test(sing)) lostInClassico.push(sing)
    if ((Array.isArray(midi) ? midi : [midi]).length !== lengths.length) throw new Error(`line ${i + 1}: "${text}" has ${lengths.length} lengths for its notes`)
  }
  if (beats !== 8) throw new Error(`line ${i + 1} lasts 8 beats, not ${beats}`)
  if (sung === 0) throw new Error(`line ${i + 1} has no sung syllable`)
})
if (!LINES.some(line => line.bar < DROPS[0].from)) throw new Error('form: a line before the first drop')
if (!LINES.some(line => line.bar >= DROPS[0].from && line.bar < DROPS[0].to)) throw new Error('form: a line in the first drop')

const TOTAL_BARS = BARS.length
const TAIL = 3.5
const DURATION = TOTAL_BARS * BAR + TAIL
const OUTRO_AT = OUTRO_BAR * BAR
// A song may ask for a progressive build (`build`, bars): when the bass, the
// pad and the drums enter, a heartbeat (kick alone) before the drums, and the
// bar from which the piano plays its full arpeggio (sparser before it). The
// defaults are the first form's.
const BUILD = SONG.build ?? {}
const BASS_BAR = BUILD.bass ?? 2
const PAD_BAR = BUILD.pad ?? 6
const DRUMS_BAR = BUILD.drums ?? 6
const HEARTBEAT_BAR = BUILD.heartbeat ?? DRUMS_BAR
const PIANO_BAR = BUILD.piano ?? 0
for (const [part, bar] of Object.entries(BUILD)) {
  if (!['bass', 'pad', 'drums', 'heartbeat', 'piano'].includes(part)) throw new Error(`build: no part ${part} (bass, pad, drums, heartbeat, piano)`)
  if (!Number.isInteger(bar) || bar < 0 || bar >= OUTRO_BAR) throw new Error(`build: ${part} enters at a bar from 0 to ${OUTRO_BAR - 1}, before the outro, not ${JSON.stringify(bar)}`)
}
if (HEARTBEAT_BAR > DRUMS_BAR) throw new Error(`build: the heartbeat (bar ${HEARTBEAT_BAR}) comes before the drums (bar ${DRUMS_BAR}), not after`)
const SEGMENTS = BARS.flatMap((bar, i) => {
  let t = i * BAR
  return bar.map(([name, beats]) => {
    const seg = { name, beats, t0: t, bar: i }
    t += beats * BEAT
    return seg
  })
})

const clamp = (x, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x))
const smoothstep = x => x * x * (3 - 2 * x)
const mtof = m => 440 * Math.pow(2, (m - 69) / 12)

function mulberry32(a) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(SONG.seed)

// ---------- the voice: formant synthesis ----------
// Each sound is a set of five resonances (formants) the voice passes through;
// consonants add bursts and hiss of filtered noise, or a brief murmur.

const VOWELS = {
  a: { F: [800, 1200, 2500, 3500, 4500], B: [80, 90, 120, 150, 200] },
  e: { F: [450, 1900, 2550, 3500, 4500], B: [70, 100, 120, 150, 200] },
  i: { F: [300, 2300, 3000, 3700, 4500], B: [60, 100, 120, 150, 200] },
  o: { F: [500, 900, 2500, 3500, 4500], B: [70, 80, 120, 150, 200] },
  u: { F: [330, 700, 2400, 3500, 4500], B: [60, 80, 120, 150, 200] },
}
const SONORANTS = {
  m: { dur: 0.07, av: 0.3, F: [250, 1100, 2300, 3300, 4300], B: [100, 300, 300, 300, 300] },
  n: { dur: 0.06, av: 0.3, F: [250, 1700, 2600, 3500, 4500], B: [100, 300, 300, 300, 300] },
  l: { dur: 0.05, av: 0.55, F: [360, 1300, 2700, 3500, 4500], B: [80, 150, 200, 250, 300] },
  r: { dur: 0.05, av: 0.5, F: [450, 1300, 1700, 3500, 4500], B: [80, 150, 200, 250, 300], tap: true },
}
const FRICATIVES = {
  s: { dur: 0.085, an: 0.45, nf: 6000, nb: 3000 },
  f: { dur: 0.07, an: 0.15, nf: 4500, nb: 5000 },
}
const STOPS = {
  p: { closure: 0.045, burst: 0.012, an: 0.3, nf: 1000, nb: 1500, locus: 800 },
  t: { closure: 0.035, burst: 0.015, an: 0.45, nf: 4500, nb: 3000, locus: 1800 },
  d: { closure: 0.03, burst: 0.01, an: 0.25, nf: 3800, nb: 3000, locus: 1700, voiceBar: 0.1 },
  k: { closure: 0.04, burst: 0.02, an: 0.4, nf: 2200, nb: 1500, locus: 2000 },
  C: { closure: 0.03, burst: 0.07, an: 0.4, nf: 3300, nb: 2500, locus: 2000 }, // the c of c'è
}
// The advanced style's own sounds, named apart so the classic style never meets them.
STOPS['b+'] = { closure: 0.04, burst: 0.008, an: 0.15, nf: 900, nb: 1500, locus: 800, voiceBar: 0.15 }
STOPS['g+'] = { closure: 0.035, burst: 0.015, an: 0.25, nf: 2000, nb: 1500, locus: 2000, voiceBar: 0.12 }
STOPS['G+'] = { closure: 0.03, burst: 0.06, an: 0.3, nf: 3000, nb: 2500, locus: 2000, voiceBar: 0.12 } // the g of gelato
STOPS['z+'] = { closure: 0.03, burst: 0.07, an: 0.35, nf: 6000, nb: 3000, locus: 1800, voiceBar: 0.08 }
FRICATIVES['v+'] = { dur: 0.06, an: 0.12, nf: 4000, nb: 5000, av: 0.35 }
SONORANTS['gn+'] = { dur: 0.08, av: 0.3, F: [250, 2000, 2700, 3500, 4500], B: [100, 300, 300, 300, 300] }
SONORANTS['gli+'] = { dur: 0.07, av: 0.5, F: [300, 2000, 2800, 3500, 4500], B: [80, 150, 200, 250, 300] }
const isVowel = p => p in VOWELS

// Italian spelling to the sounds above.
function phonemes(text) {
  const s = text.toLowerCase().replace(/[^a-z]/g, '')
  const out = []
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    const next = s[i + 1]
    if (c === 'h') continue
    if (ADVANCED) {
      if (c === 'g' && next === 'h') { out.push('g+'); i++; continue }
      if (c === 'g' && next === 'n') { out.push('gn+'); i++; continue }
      if (c === 'g' && next === 'l' && s[i + 2] === 'i') { out.push('gli+'); i++; continue }
      if (c === 'g' && (next === 'e' || next === 'i')) { out.push('G+'); continue }
      if (c === 'g' || c === 'b' || c === 'v' || c === 'z') { out.push(`${c}+`); continue }
    }
    if (c === 'c' && next === 'h') { out.push('k'); i++; continue }
    if (c === 'c' && (next === 'e' || next === 'i')) { out.push('C'); continue }
    if (c === 'c' || c === 'q') { out.push('k'); continue }
    out.push(c)
  }
  return out
}

// The vowel that holds the note: a leading i or u before another vowel glides into it.
function nucleusOf(ph) {
  const vowels = ph.filter(isVowel)
  const index = vowels.length > 1 && (vowels[0] === 'i' || vowels[0] === 'u') ? 1 : 0
  return { vowels, index }
}

// The syllable as timed pieces: onset consonants, glide, the held vowel, offglide, coda.
function plan(ph, Ds) {
  const first = ph.findIndex(isVowel)
  let last = first
  for (let i = ph.length - 1; i >= 0; i--) if (isVowel(ph[i])) { last = i; break }
  const onset = ph.slice(0, first)
  const coda = ph.slice(last + 1)
  const { vowels, index } = nucleusOf(ph)
  const firstVowel = VOWELS[vowels[0]]
  const locusOf = locus => ({
    F: [250, 0.6 * locus + 0.4 * firstVowel.F[1], firstVowel.F[2], firstVowel.F[3], firstVowel.F[4]],
    B: [90, 120, 150, 200, 250],
  })
  const pieces = []
  for (const c of onset) {
    if (c in STOPS) {
      const s = STOPS[c]
      const L = locusOf(s.locus)
      pieces.push({ dur: s.closure, F: L.F, B: L.B, av: s.voiceBar ?? 0, an: 0 })
      pieces.push({ dur: s.burst, F: L.F, B: L.B, av: 0, an: s.an, nf: s.nf, nb: s.nb })
    } else if (c in FRICATIVES) {
      const s = FRICATIVES[c]
      pieces.push({ dur: s.dur, F: firstVowel.F, B: firstVowel.B, av: s.av ?? 0, an: s.an, nf: s.nf, nb: s.nb })
    } else if (c in SONORANTS) {
      const s = SONORANTS[c]
      pieces.push({ dur: s.dur, F: s.F, B: s.B, av: s.av, an: 0, tap: s.tap })
    }
  }
  vowels.forEach((v, i) => {
    const P = VOWELS[v]
    if (i < index) pieces.push({ dur: 0.06, F: P.F, B: P.B, av: 0.85, an: 0 })
    else if (i === index) pieces.push({ dur: null, F: P.F, B: P.B, av: 1, an: 0, isNucleus: true })
    else pieces.push({ dur: 0.07, F: P.F, B: P.B, av: 0.9, an: 0 })
  })
  // The coda, what follows the vowel: a sonorant hums, a fricative hisses, a
  // stop closes and bursts; a letter this voice style does not sing is skipped.
  const lastVowel = VOWELS[vowels[vowels.length - 1]]
  for (const c of coda) {
    if (c in SONORANTS) {
      const s = SONORANTS[c]
      pieces.push({ dur: s.dur, F: s.F, B: s.B, av: s.av, an: 0, tap: s.tap })
    } else if (c in FRICATIVES) {
      const s = FRICATIVES[c]
      pieces.push({ dur: s.dur, F: lastVowel.F, B: lastVowel.B, av: s.av ?? 0, an: s.an, nf: s.nf, nb: s.nb })
    } else if (c in STOPS) {
      const s = STOPS[c]
      const L = locusOf(s.locus)
      pieces.push({ dur: s.closure, F: L.F, B: L.B, av: s.voiceBar ?? 0, an: 0 })
      pieces.push({ dur: s.burst, F: L.F, B: L.B, av: 0, an: s.an, nf: s.nf, nb: s.nb })
    }
  }
  const fixed = pieces.reduce((sum, p) => sum + (p.dur ?? 0), 0)
  const scale = fixed > 0.6 * Ds ? (0.6 * Ds) / fixed : 1
  let t = 0
  return pieces.map(p => {
    const dur = p.dur === null ? Ds - fixed * scale : p.dur * scale
    const seg = { ...p, t0: t, t1: t + dur }
    t += dur
    return seg
  })
}

function coeffs(F, B) {
  const T = 1 / VSR
  const c = -Math.exp(-2 * Math.PI * B * T)
  const b = 2 * Math.exp(-Math.PI * B * T) * Math.cos(2 * Math.PI * F * T)
  return [1 - b - c, b, c]
}

const noiseGains = new Map()
function noiseNorm(nf, nb) {
  const key = `${nf}/${nb}`
  if (!noiseGains.has(key)) {
    const [a, b, c] = coeffs(nf, nb)
    const r = mulberry32(1)
    let y1 = 0
    let y2 = 0
    let ss = 0
    for (let i = 0; i < 8000; i++) {
      const y = a * (r() * 2 - 1) + b * y1 + c * y2
      y2 = y1
      y1 = y
      ss += y * y
    }
    noiseGains.set(key, 1 / Math.sqrt(ss / 8000))
  }
  return noiseGains.get(key)
}

let VREF = 1
const CTRL = 32
function synthSyllable(segs, Ds, pitch) {
  const n = Math.ceil(Ds * VSR)
  const out = new Float32Array(n)
  const state = Array.from({ length: 5 }, () => [0, 0])
  const phases = new Float64Array(64)
  const smooth = 1 - Math.exp(-1 / (0.006 * VSR))
  let k = 0
  let cf = []
  let nfc = null
  let ny1 = 0
  let ny2 = 0
  let av = 0
  let an = 0
  let avS = 0
  let anS = 0
  let gainNoise = 0
  let f0 = 220
  for (let i = 0; i < n; i++) {
    const t = i / VSR
    if (i % CTRL === 0) {
      while (k < segs.length - 1 && t >= segs[k].t1) k++
      const s = segs[k]
      const p = segs[k - 1]
      const w = p ? smoothstep(clamp((t - s.t0) / 0.035)) : 1
      cf = s.F.map((f, j) => coeffs(p ? p.F[j] * (1 - w) + f * w : f, p ? p.B[j] * (1 - w) + s.B[j] * w : s.B[j]))
      av = s.av
      if (s.tap) av *= 1 - 0.85 * Math.exp(-(((t - (s.t0 + s.t1) / 2) / 0.008) ** 2))
      an = s.an
      if (s.an > 0) {
        nfc = coeffs(s.nf, s.nb)
        gainNoise = noiseNorm(s.nf, s.nb)
      }
      f0 = pitch(t)
    }
    avS += (av - avS) * smooth
    anS += (an - anS) * smooth
    const H = Math.min(63, Math.floor(9000 / f0))
    let src = 0
    for (let h = 1; h < 64; h++) {
      phases[h] += (2 * Math.PI * h * f0) / VSR
      if (h <= H) src += Math.sin(phases[h]) / h
    }
    let x = (src + (rand() * 2 - 1) * 0.02) * avS
    for (let j = 0; j < 5; j++) {
      const [a, b, c] = cf[j]
      const y = a * x + b * state[j][0] + c * state[j][1]
      state[j][1] = state[j][0]
      state[j][0] = y
      x = y
    }
    if (nfc) {
      const [a, b, c] = nfc
      const ny = a * (rand() * 2 - 1) + b * ny1 + c * ny2
      ny2 = ny1
      ny1 = ny
      x += ny * gainNoise * anS * VREF
    }
    out[i] = x * clamp(t / 0.015) * clamp((Ds - t) / 0.04)
  }
  return out
}

{
  const a = VOWELS.a
  const probe = synthSyllable([{ t0: 0, t1: 0.5, F: a.F, B: a.B, av: 1, an: 0 }], 0.5, () => 330)
  let ss = 0
  for (let i = 2000; i < 9000; i++) ss += probe[i] ** 2
  VREF = Math.sqrt(ss / 7000)
}

// ---------- song timing ----------
const syllables = []
const lines = []
for (const line of LINES) {
  let cursor = line.bar * BAR
  const out = { start: cursor, end: cursor, syls: [] }
  line.syl.forEach(([text, sing, midi, beats], i) => {
    const mids = Array.isArray(midi) ? midi : [midi]
    const bts = Array.isArray(beats) ? beats : [beats]
    const total = bts.reduce((s, x) => s + x, 0) * BEAT
    if (sing === null) { cursor += total; return }
    const notes = []
    let nt = cursor
    mids.forEach((m, j) => { notes.push({ midi: m, start: nt, dur: bts[j] * BEAT }); nt += bts[j] * BEAT })
    const next = line.syl[i + 1]
    const gap = !next || next[1] === null ? 0.12 : 0.03
    const { vowels, index } = nucleusOf(phonemes(sing))
    const v = vowels[index]
    const open = v === 'a' ? 1 : v === 'e' || v === 'o' ? 0.75 : 0.5
    const syl = { text, sing, notes, start: cursor, end: cursor + total, soundEnd: cursor + total - gap, open }
    syllables.push(syl)
    out.syls.push({ text, start: +syl.start.toFixed(3), end: +syl.end.toFixed(3), open })
    out.end = syl.end
    cursor += total
  })
  out.start = out.syls[0].start
  out.end = +out.end.toFixed(3)
  lines.push(out)
}

function pitchAt(syl, tAbs, prevF) {
  let idx = 0
  for (let i = 0; i < syl.notes.length; i++) if (tAbs >= syl.notes[i].start) idx = i
  const note = syl.notes[idx]
  const target = mtof(note.midi)
  const from = idx > 0 ? mtof(syl.notes[idx - 1].midi) : prevF ?? target
  const dt = tAbs - note.start
  let f = from * Math.pow(target / from, smoothstep(clamp(dt / 0.07)))
  const depth = 30 * clamp((dt - 0.22) / 0.35)
  f *= Math.pow(2, (depth * Math.sin(2 * Math.PI * 5.3 * tAbs) + 4 * Math.sin(2 * Math.PI * 2.7 * tAbs)) / 1200)
  return f
}

// ---------- the vocal ----------
const vocal = new Float32Array(Math.ceil(DURATION * VSR) + VSR)
// Each syllable's loudest sample, to find one that sets the voice's level alone.
const peaks = []
{
  let prevF = null
  let prevEnd = -1
  for (const syl of syllables) {
    const glide = syl.start - prevEnd < 0.15 ? prevF : null
    const Ds = syl.soundEnd - syl.start
    const segs = plan(phonemes(syl.sing), Ds)
    const buf = synthSyllable(segs, Ds, t => pitchAt(syl, syl.start + t, glide))
    // Every held vowel sung at the same loudness, its consonants in proportion.
    const nucleus = segs.find(s => s.isNucleus)
    let ss = 0
    let count = 0
    for (let i = Math.round(nucleus.t0 * VSR); i < Math.round(nucleus.t1 * VSR) && i < buf.length; i++) { ss += buf[i] ** 2; count++ }
    const level = Math.min(4, 1 / (Math.sqrt(ss / Math.max(1, count)) + 1e-9))
    const base = Math.round(syl.start * VSR)
    let top = 0
    for (let i = 0; i < buf.length; i++) {
      vocal[base + i] += buf[i] * level
      top = Math.max(top, Math.abs(buf[i] * level))
    }
    peaks.push({ sing: syl.sing, at: +syl.start.toFixed(2), peak: +top.toFixed(2) })
    prevF = mtof(syl.notes[syl.notes.length - 1].midi)
    prevEnd = syl.soundEnd
  }
  let peak = 0
  for (const s of vocal) peak = Math.max(peak, Math.abs(s))
  for (let i = 0; i < vocal.length; i++) vocal[i] *= 0.6 / peak
  // A song may ask for the voice at a set average level (`voiceRms`, as the
  // voiceByLine check measures it) instead of by its loudest moment: one spike
  // then no longer sets the whole voice, and every style of the song sings
  // equally loud, so styles compare by sound and not by level.
  if (SONG.voiceRms) {
    let sum = 0
    for (const line of lines) {
      let ss = 0
      const from = Math.round(line.start * VSR)
      const to = Math.round(line.end * VSR)
      for (let i = from; i < to; i++) ss += vocal[i] ** 2
      sum += Math.sqrt(ss / Math.max(1, to - from))
    }
    const scale = SONG.voiceRms / (sum / lines.length)
    for (let i = 0; i < vocal.length; i++) vocal[i] *= scale
  }
}

// upsample the vocal to SR (Catmull-Rom)
const N = Math.ceil(DURATION * SR)
const voc = new Float32Array(N)
for (let n = 0; n < N; n++) {
  const x = (n * VSR) / SR
  const i = Math.floor(x)
  const t = x - i
  const p0 = vocal[i - 1] ?? 0
  const p1 = vocal[i] ?? 0
  const p2 = vocal[i + 1] ?? 0
  const p3 = vocal[i + 2] ?? 0
  voc[n] = p1 + 0.5 * t * (p2 - p0 + t * (2 * p0 - 5 * p1 + 4 * p2 - p3 + t * (3 * (p1 - p2) + p3 - p0)))
}

// ---------- band ----------
const L = new Float32Array(N)
const Rt = new Float32Array(N)
const send = new Float32Array(N)

function addStereo(n, s, pan, wet) {
  if (n < 0 || n >= N) return
  L[n] += s * Math.cos((pan + 1) * Math.PI / 4)
  Rt[n] += s * Math.sin((pan + 1) * Math.PI / 4)
  send[n] += s * wet
}

const ORCHESTRA_BANDS = {
  pop: popBand,
  antica: anticaBand,
  rave: raveBand,
}

// ---------- the pop orchestra: piano, pad, bass, drums, lead and bells ----------
function popBand() {
  function piano(t0, midi, dur, vel) {
    const f = mtof(midi)
    const start = Math.round(t0 * SR)
    const len = Math.round((dur + 1.4) * SR)
    const pan = clamp((midi - 62) / 28, -0.6, 0.6)
    const H = Math.min(12, Math.floor(10000 / f))
    const buf = new Float32Array(len)
    for (let h = 1; h <= H; h++) {
      const fh = f * h * Math.sqrt(1 + 0.00035 * h * h)
      const a = vel * Math.pow(h, -1.2) * (1 + 0.35 * Math.sin(h * 1.7))
      const decay = 0.8 + 0.4 * h + f / 600
      const w = (2 * Math.PI * fh) / SR
      for (let n = 0; n < len; n++) {
        const t = n / SR
        let env = Math.exp(-decay * t) * Math.min(1, t / 0.004)
        if (t > dur) env *= Math.exp(-(t - dur) / 0.2)
        buf[n] += a * env * Math.sin(w * n)
      }
    }
    for (let n = 0; n < len; n++) addStereo(start + n, buf[n] * 0.5, pan, 0.35)
  }

  function voicing(name) {
    const [r, iv] = CHORD[name]
    return { r, third: iv[1], fifth: iv[2], seventh: iv[3] }
  }

  SEGMENTS.forEach(({ name, beats, t0, bar }) => {
    const { r, third, fifth, seventh } = voicing(name)
    let vel = bar < INTRO_BARS ? 0.45 : isDrop(bar) ? 0.7 : bar >= OUTRO_BAR ? 0.5 : 0.55
    const lo = r + 12
    if (bar < PIANO_BAR) {
      // Before the full arpeggio: the root and a broken chord, three notes a
      // bar in the intro, a quarter-note climb after, growing louder bar by bar.
      vel = 0.3 + 0.25 * (bar / PIANO_BAR)
      const climb = [lo, lo + fifth, lo + 12, lo + 12 + third]
      const beatsOf = bar < INTRO_BARS ? [0, 2, 3] : [0, 1, 2, 3]
      piano(t0, r, beats * BEAT * 0.95, vel * 0.8)
      beatsOf.forEach((b, i) => { if (b < beats) piano(t0 + b * BEAT, climb[i], BEAT * 1.8, vel * (i === 0 ? 1 : 0.85)) })
      return
    }
    if (bar === TOTAL_BARS - 1) {
      // final chord, rolled and left to ring
      ;[r, lo, lo + fifth, lo + 12, lo + 12 + third, lo + 12 + fifth, lo + 24].forEach((m, i) => piano(t0 + i * 0.06, m, BAR + TAIL - 1, 0.55))
      return
    }
    const pattern = [lo, lo + fifth, lo + 12, lo + 12 + third, lo + 12 + (seventh ?? fifth), lo + 12 + third, lo + 12, lo + fifth]
    for (let i = 0; i < beats * 2; i++) piano(t0 + (i * BEAT) / 2, pattern[i % 8], BEAT * 1.6, vel * (i === 0 ? 1 : 0.75))
    piano(t0, r, beats * BEAT * 0.95, vel * 0.8)
  })

  // pad (from the pad bar to the outro)
  function pad(t0, t1, midis, gain) {
    const start = Math.round(t0 * SR)
    const end = Math.round((t1 + 1.2) * SR)
    const a = 1 - Math.exp((-2 * Math.PI * 1600) / SR)
    midis.forEach(m => {
      ;[-8, 0, 8].forEach((cents, di) => {
        const f = mtof(m) * Math.pow(2, cents / 1200)
        let ph = rand()
        let y1 = 0
        let y2 = 0
        const pan = (di - 1) * 0.7
        for (let n = start; n < end && n < N; n++) {
          const t = (n - start) / SR
          ph += f / SR
          if (ph >= 1) ph -= 1
          const s = 2 * ph - 1
          y1 += a * (s - y1)
          y2 += a * (y1 - y2)
          const env = clamp(t / 0.9) * (n / SR > t1 ? Math.exp(-(n / SR - t1) / 0.5) : 1)
          addStereo(n, y2 * env * gain, pan, 0.6)
        }
      })
    })
  }
  SEGMENTS.forEach(({ name, beats, t0, bar }) => {
    if (bar < PAD_BAR || bar >= OUTRO_BAR) return
    const { r, third, fifth, seventh } = voicing(name)
    pad(t0, t0 + beats * BEAT, [r + 12, r + 12 + third, r + 12 + fifth, r + 12 + (seventh ?? 12)], isDrop(bar) ? 0.05 : 0.03)
  })

  // bass
  function bass(t0, midi, dur, gain) {
    const f = mtof(midi)
    const start = Math.round(t0 * SR)
    const len = Math.round((dur + 0.3) * SR)
    for (let n = 0; n < len; n++) {
      const t = n / SR
      let env = clamp(t / 0.01) * (0.6 + 0.4 * Math.exp(-t * 3))
      if (t > dur) env *= Math.exp(-(t - dur) / 0.08)
      const s = Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(4 * Math.PI * f * t) + 0.12 * Math.sin(6 * Math.PI * f * t)
      addStereo(start + n, s * env * gain * 0.8, 0, 0.05)
    }
  }
  SEGMENTS.forEach(({ name, beats, t0, bar }) => {
    if (bar < BASS_BAR) return
    const { r } = voicing(name)
    if (bar === TOTAL_BARS - 1) { bass(t0, r, BAR + 1.5, 0.22); return }
    if (bar >= DRUMS_BAR && bar < OUTRO_BAR && beats === 4) {
      bass(t0, r, BEAT * 1.9, 0.22)
      bass(t0 + 2 * BEAT, r, BEAT * 1.4, 0.2)
      bass(t0 + 3.5 * BEAT, r + 12, BEAT * 0.45, 0.12)
    } else bass(t0, r, beats * BEAT * 0.95, 0.2)
  })

  // drums
  function kick(t0, gain) {
    const start = Math.round(t0 * SR)
    let ph = 0
    for (let n = 0; n < 0.45 * SR; n++) {
      const t = n / SR
      ph += (2 * Math.PI * (48 + 95 * Math.exp(-t * 28))) / SR
      addStereo(start + n, Math.sin(ph) * Math.exp(-t * 7) * gain, 0, 0.05)
    }
  }
  function snare(t0, gain) {
    const start = Math.round(t0 * SR)
    let prev = 0
    for (let n = 0; n < 0.4 * SR; n++) {
      const t = n / SR
      const w = rand() * 2 - 1
      const hp = w - prev
      prev = w
      const s = hp * 0.5 * Math.exp(-t * 16) + Math.sin(2 * Math.PI * 185 * t) * 0.35 * Math.exp(-t * 22)
      addStereo(start + n, s * gain, 0.05, 0.45)
    }
  }
  function hat(t0, gain) {
    const start = Math.round(t0 * SR)
    let p1 = 0
    let p2 = 0
    for (let n = 0; n < 0.08 * SR; n++) {
      const t = n / SR
      const w = rand() * 2 - 1
      const d1 = w - p1
      const d2 = d1 - p2
      p1 = w
      p2 = d1
      addStereo(start + n, d2 * Math.exp(-t * 55) * gain, 0.3, 0.1)
    }
  }
  function crash(t0, gain) {
    const start = Math.round(t0 * SR)
    let p1 = 0
    for (let n = 0; n < 2.5 * SR; n++) {
      const t = n / SR
      const w = rand() * 2 - 1
      const d = w - p1
      p1 = w
      addStereo(start + n, d * Math.exp(-t * 1.8) * gain * clamp(t / 0.005), -0.3, 0.4)
    }
  }
  for (let bar = HEARTBEAT_BAR; bar < OUTRO_BAR; bar++) {
    const t0 = bar * BAR
    const isFinale = isDrop(bar)
    if (bar < DRUMS_BAR) {
      // A heartbeat: a kick and its softer echo on every beat, nothing else.
      for (let b = 0; b < 4; b++) { kick(t0 + b * BEAT, 0.3); kick(t0 + b * BEAT + 0.2, 0.17) }
      continue
    }
    kick(t0, 0.5)
    kick(t0 + 2 * BEAT, 0.42)
    if (isFinale) kick(t0 + 2.5 * BEAT, 0.3)
    snare(t0 + BEAT, isFinale ? 0.32 : 0.22)
    snare(t0 + 3 * BEAT, isFinale ? 0.32 : 0.22)
    if (isFinale) for (let i = 0; i < 8; i++) hat(t0 + (i * BEAT) / 2, i % 2 ? 0.05 : 0.08)
  }
  CRASH_BARS.forEach((bar, i) => crash(bar * BAR, i === CRASH_BARS.length - 1 ? 0.08 : 0.12))

  // a soft lead doubling the melody, and bells in the drops
  for (const syl of syllables) {
    syl.notes.forEach(note => {
      const f = mtof(note.midi)
      const start = Math.round(note.start * SR)
      const dur = Math.min(note.dur, syl.soundEnd - note.start)
      for (let n = 0; n < dur * SR + 0.1 * SR; n++) {
        const t = n / SR
        const ph = (f * t) % 1
        const tri = 4 * Math.abs(ph - 0.5) - 1
        let env = clamp(t / 0.04)
        if (t > dur) env *= Math.exp(-(t - dur) / 0.04)
        addStereo(start + n, tri * env * 0.03, 0, 0.5)
      }
      if (isDropAt(note.start)) {
        for (let n = 0; n < 1.5 * SR; n++) {
          const t = n / SR
          const s = Math.sin(2 * Math.PI * 2 * f * t) + 0.3 * Math.sin(2 * Math.PI * 5.4 * f * t) * Math.exp(-t * 6)
          addStereo(start + n, s * Math.exp(-t * 2.5) * 0.035, 0.4, 0.6)
        }
      }
    })
  }
}

// ---------- the ancient orchestra ----------
// A plucked lyre (Karplus-Strong: a burst of noise circling a delay as long as
// the note's period, softened each time round), a reed that sings the melody
// (odd harmonics, a nasal peak, vibrato and breath), frame drums (a deep doum,
// a dry tek, a jingle), a choir singing "ah" (harmonics shaped by the vowel's
// resonances) and a drone held under it all.
function anticaBand() {
  const chordOf = name => {
    const [r, iv] = CHORD[name]
    return { r, third: iv[1], fifth: iv[2] }
  }

  // The lyre plucked with a plectrum: a burst of noise circling the string's
  // loop, softened two points at a time; bright, as the lyre was first made.
  function lyrePlettro(t0, midi, gain, pan = 0, ring = 2.4) {
    const f = mtof(midi)
    const period = SR / f
    const D = period - 0.5
    const len = Math.round(ring * SR)
    const y = new Float32Array(len)
    const burst = Math.ceil(period)
    let prev = 0
    for (let n = 0; n < burst && n < len; n++) {
      prev = prev * 0.45 + (rand() * 2 - 1) * 0.55
      y[n] = prev
    }
    const decay = Math.pow(0.001, 1 / (f * ring))
    for (let n = burst; n < len; n++) {
      const x = n - D
      const i = Math.floor(x)
      const fr = x - i
      const a = (y[i] ?? 0) * (1 - fr) + (y[i + 1] ?? 0) * fr
      const b = (y[i - 1] ?? 0) * (1 - fr) + (y[i] ?? 0) * fr
      y[n] = decay * 0.5 * (a + b)
    }
    const start = Math.round(t0 * SR)
    for (let n = 0; n < len; n++) addStereo(start + n, y[n] * gain * clamp((len - n) / (0.05 * SR)), pan, 0.4)
  }

  // The lyre's gut string plucked by a fingertip: the string pulled into a
  // triangle (a quarter of the way along) with a breath of noise, a loop that
  // softens it three points at a time so its highs die early, then the wooden
  // body: two low resonances and a gentle cut of what is left high.
  function lyreDita(t0, midi, gain, pan = 0, ring = 2.4) {
    const f = mtof(midi)
    const period = SR / f
    const len = Math.round(ring * SR)
    const y = new Float32Array(len)
    const burst = Math.ceil(period)
    let mean = 0
    for (let n = 0; n < burst && n < len; n++) {
      const x = n / period
      const tri = x < 0.25 ? x / 0.25 : (1 - x) / 0.75
      y[n] = tri + (rand() * 2 - 1) * 0.06
      mean += y[n]
    }
    mean /= burst
    for (let n = 0; n < burst && n < len; n++) y[n] -= mean
    const decay = Math.pow(0.001, 1 / (f * ring))
    const at = x => {
      const i = Math.floor(x)
      const fr = x - i
      return (y[i] ?? 0) * (1 - fr) + (y[i + 1] ?? 0) * fr
    }
    for (let n = burst; n < len; n++) {
      const x = n - period
      y[n] = decay * (0.25 * at(x - 1) + 0.5 * at(x) + 0.25 * at(x + 1))
    }
    // The body: a one-pole cut near 2.6 kHz, and wood resonating at 230 and 480 Hz.
    const lp = 1 - Math.exp((-2 * Math.PI * 2600) / SR)
    const body = [230, 480].map(fb => {
      const r = Math.exp((-Math.PI * 60) / SR)
      return { b1: 2 * r * Math.cos((2 * Math.PI * fb) / SR), b2: -r * r, y1: 0, y2: 0, g: 1 - r }
    })
    let low = 0
    const start = Math.round(t0 * SR)
    for (let n = 0; n < len; n++) {
      low += lp * (y[n] - low)
      let wood = 0
      for (const b of body) {
        const out = b.g * low + b.b1 * b.y1 + b.b2 * b.y2
        b.y2 = b.y1
        b.y1 = out
        wood += out
      }
      const s = low * 0.8 + wood * 0.6
      const env = clamp(n / (0.004 * SR)) * clamp((len - n) / (0.05 * SR))
      addStereo(start + n, s * gain * env, pan, 0.4)
    }
  }

  const lyre = LYRE === 'dita' ? lyreDita : lyrePlettro

  function reed(t0, midi, dur, gain, pan = 0.15) {
    const f0 = mtof(midi)
    const start = Math.round(t0 * SR)
    const len = Math.round((dur + 0.15) * SR)
    const H = Math.min(16, Math.floor(7000 / f0))
    const amps = []
    for (let h = 1; h <= H; h++) {
      const nasal = 1 + 1.6 * Math.exp(-(((h * f0 - 1400) / 500) ** 2))
      amps.push(((h % 2 ? 1 : 0.45) / Math.pow(h, 0.9)) * nasal)
    }
    const phases = new Float64Array(H + 1)
    let prev = 0
    for (let n = 0; n < len; n++) {
      const t = n / SR
      const vib = Math.pow(2, (16 * clamp((t - 0.25) / 0.3) * Math.sin(2 * Math.PI * 5.2 * t)) / 1200)
      const f = f0 * vib
      let s = 0
      for (let h = 1; h <= H; h++) {
        phases[h] += (2 * Math.PI * h * f) / SR
        s += Math.sin(phases[h]) * amps[h - 1]
      }
      const w = rand() * 2 - 1
      const breath = (w - prev) * 0.04
      prev = w
      let env = smoothstep(clamp(t / 0.06))
      if (t > dur) env *= Math.exp(-(t - dur) / 0.06)
      addStereo(start + n, (s * 0.25 + breath) * env * gain, pan, 0.45)
    }
  }

  function doum(t0, gain) {
    const start = Math.round(t0 * SR)
    let ph = 0
    for (let n = 0; n < 0.6 * SR; n++) {
      const t = n / SR
      ph += (2 * Math.PI * (58 + 40 * Math.exp(-t * 18))) / SR
      addStereo(start + n, Math.sin(ph) * Math.exp(-t * 6) * gain, 0, 0.12)
    }
  }
  function tek(t0, gain) {
    const start = Math.round(t0 * SR)
    let prev = 0
    for (let n = 0; n < 0.12 * SR; n++) {
      const t = n / SR
      const w = rand() * 2 - 1
      const hp = w - prev
      prev = w
      const s = hp * 0.5 * Math.exp(-t * 45) + Math.sin(2 * Math.PI * 620 * t) * 0.35 * Math.exp(-t * 30)
      addStereo(start + n, s * gain, 0.2, 0.3)
    }
  }
  function jingle(t0, gain) {
    const start = Math.round(t0 * SR)
    let p1 = 0
    let p2 = 0
    for (let n = 0; n < 0.18 * SR; n++) {
      const t = n / SR
      const w = rand() * 2 - 1
      const d1 = w - p1
      const d2 = d1 - p2
      p1 = w
      p2 = d1
      const shimmer = 0.6 + 0.4 * Math.sin(2 * Math.PI * 38 * t)
      addStereo(start + n, d2 * Math.exp(-t * 22) * shimmer * gain, -0.25, 0.2)
    }
  }

  // The vowel "ah" as a choir sings it: four resonances, how loud each is.
  const AH = { F: [750, 1150, 2600, 3300], B: [90, 110, 140, 180], G: [1, 0.55, 0.25, 0.15] }
  function choir(t0, t1, midis, gain) {
    const start = Math.round(t0 * SR)
    const end = Math.round((t1 + 0.8) * SR)
    for (const midi of midis) {
      for (const cents of [-5, 5]) {
        const f0 = mtof(midi) * Math.pow(2, cents / 1200)
        const H = Math.floor(4500 / f0)
        const amps = []
        for (let h = 1; h <= H; h++) {
          let a = 0
          for (let k = 0; k < 4; k++) a += AH.G[k] / (1 + ((h * f0 - AH.F[k]) / AH.B[k]) ** 2)
          amps.push(a / Math.pow(h, 0.3))
        }
        const phases = new Float64Array(H + 1)
        const wob = rand() * 6
        for (let n = start; n < end && n < N; n++) {
          const t = (n - start) / SR
          const f = f0 * Math.pow(2, (8 * Math.sin(2 * Math.PI * 4.5 * t + wob)) / 1200)
          let s = 0
          for (let h = 1; h <= H; h++) {
            phases[h] += (2 * Math.PI * h * f) / SR
            s += Math.sin(phases[h]) * amps[h - 1]
          }
          const env = smoothstep(clamp(t / 1.2)) * (n / SR > t1 ? Math.exp(-(n / SR - t1) / 0.5) : 1)
          addStereo(n, s * env * gain, cents < 0 ? -0.5 : 0.5, 0.65)
        }
      }
    }
  }

  // The drone: its notes held from the start, swelling once the voice comes in.
  {
    const notes = SONG.drone ?? []
    const fadeFrom = DURATION - 2.5
    for (const midi of notes) {
      const f = mtof(midi)
      for (let n = 0; n < N; n++) {
        const t = n / SR
        const swell = 0.4 + 0.6 * smoothstep(clamp((t - INTRO_BARS * BAR + 1) / 3))
        const fade = t > fadeFrom ? Math.max(0, 1 - (t - fadeFrom) / 2.5) : 1
        const s = Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(4 * Math.PI * f * t) + 0.25 * Math.sin(6 * Math.PI * f * t) + 0.12 * Math.sin(8 * Math.PI * f * t)
        addStereo(n, s * 0.035 * swell * fade * clamp(t / 1.5), 0, 0.3)
      }
    }
  }

  // The lyre: the chord broken in eighths every bar, a low pluck on the root
  // from bar 2, the last chord rolled and left to ring.
  SEGMENTS.forEach(({ name, beats, t0, bar }) => {
    const { r, third, fifth } = chordOf(name)
    const vel = bar < INTRO_BARS ? 0.45 : isDrop(bar) ? 0.6 : bar >= OUTRO_BAR ? 0.5 : 0.48
    const lo = r + 12
    if (bar === TOTAL_BARS - 1) {
      ;[r, lo, lo + fifth, lo + 12, lo + 12 + third, lo + 12 + fifth, lo + 24].forEach((m, i) => lyre(t0 + i * 0.09, m, 0.5, (i - 3) * 0.12, BAR + TAIL - 0.5))
      return
    }
    const pattern = [lo, lo + fifth, lo + 12, lo + 12 + third, lo + 12 + fifth, lo + 12 + third, lo + 12, lo + fifth]
    for (let i = 0; i < beats * 2; i++) lyre(t0 + (i * BEAT) / 2, pattern[i % 8], vel * (i === 0 ? 1 : 0.7), clamp((pattern[i % 8] - 62) / 24, -0.5, 0.5))
    if (bar >= 2) lyre(t0, r, vel * 0.9, 0, 2.8)
  })

  // The choir from bar 6 to the outro, louder in the drops.
  SEGMENTS.forEach(({ name, beats, t0, bar }) => {
    if (bar < 6 || bar >= OUTRO_BAR) return
    const { r, third, fifth } = chordOf(name)
    choir(t0, t0 + beats * BEAT, [r + 12, r + 12 + third, r + 12 + fifth], isDrop(bar) ? 0.012 : 0.008)
  })

  // Frame drums from bar 6: doum and tek, busier in the drops, with a jingle.
  for (let bar = 6; bar < OUTRO_BAR; bar++) {
    const t0 = bar * BAR
    const isFinale = isDrop(bar)
    doum(t0, 0.4)
    tek(t0 + BEAT, 0.25)
    tek(t0 + 1.5 * BEAT, 0.18)
    doum(t0 + 2 * BEAT, 0.32)
    tek(t0 + 3 * BEAT, 0.25)
    if (isFinale) {
      doum(t0 + 2.5 * BEAT, 0.22)
      tek(t0 + 3.5 * BEAT, 0.2)
      for (let i = 0; i < 8; i++) jingle(t0 + (i * BEAT) / 2, i % 2 ? 0.04 : 0.07)
    }
  }
  // The accents of each drop and of the last one's last bar: a roll of the
  // jingle over the doum already there (a second doum on it would set the
  // song's peak).
  for (const t of CRASH_BARS.map(bar => bar * BAR)) {
    for (let i = 0; i < 6; i++) jingle(t + i * 0.05, 0.06)
  }

  // The reed: its own tune before the voice and after it, and the voice's
  // melody doubled softly in between.
  const tune = (notes, bar) => {
    let t = bar * BAR
    for (const [midi, beats] of notes) {
      reed(t, midi, beats * BEAT * 0.92, 0.35)
      t += beats * BEAT
    }
  }
  tune(SONG.reed?.intro ?? [], 0)
  tune(SONG.reed?.outro ?? [], OUTRO_BAR)
  for (const syl of syllables) {
    syl.notes.forEach(note => reed(note.start, note.midi, Math.min(note.dur, syl.soundEnd - note.start), 0.035, -0.1))
  }
}

// ---------- the rave orchestra: hardcore techno ----------
// The kick (the cassa) on every beat the band plays, a swept sine driven into
// a square until it says POM, its tail tuned to the chord's root; an acid line
// (a saw through a resonant four-pole filter, with accents and slides); rave
// stabs and a soft pad; open hats off the beat, claps on the backbeat; a snare
// roll and a noise riser at the end of each break, where the kick drops out;
// and in the drops the hoover, five detuned pulses swooping up into each chord.
// Everything but the kick ducks under each kick (the pump), and the voice comes
// back a dotted eighth later, left and right.
// Its arrangement on the form: the kick from the song's heartbeat bar, muffled
// until the drums come in and opening up on the way to them, out in the
// breaks; the acid line from the bass bar; stabs and claps from the pad bar;
// hats from the drums bar; the pad in the intro and the breaks; the hoover in
// the drops and the outro; in the outro no kick but a last one on the last bar.
// When there is more than one drop the last is the biggest: the kick driven
// harder and rolling every second bar, the pump deeper, hats and claps louder,
// the hoover doubled an octave up.
// Played happy (happy hardcore, the `happy` profile): the kick rounder, a
// bass bouncing off the beat instead of the acid line, a bright piano instead
// of the stabs, a supersaw (seven detuned saws) instead of the hoover. A
// song played happy may turn hard from a bar on (`hardFrom`): from there the
// acid line instead of the bouncing bass, the kick driven and ringing as the
// rave band's, and in the last drop the hoover over the supersaw; the piano
// stays.
function raveBand() {
  const HAPPY = MOOD === 'happy'
  // Whether the band plays hard at a bar: the rave band always, the happy one from the song's hardFrom.
  const hardAt = bar => !HAPPY || (SONG.hardFrom !== undefined && bar >= SONG.hardFrom)
  // How hard the kick is driven at a bar: in every drop but the last, and in the last.
  const DRIVE = bar => (hardAt(bar) ? 6 : 3.5)
  const HARD = bar => (hardAt(bar) ? 9 : 5)
  const isBreak = bar => partOf(bar) === 'break'
  const LAST_DROP = DROPS[DROPS.length - 1]
  const isLastDrop = bar => bar >= LAST_DROP.from && bar < LAST_DROP.to
  const LAST_BAR = FORM_BARS - 1
  const pulses = Math.round(BAR / PULSE)
  const step = PULSE / 2
  const segmentAt = t => {
    let seg = SEGMENTS[0]
    for (const s of SEGMENTS) if (s.t0 <= t + 1e-9) seg = s
    return seg
  }
  const chordAt = t => {
    const [r, iv] = CHORD[segmentAt(t).name]
    return { r, iv }
  }
  // The chord's tones within an octave from `lo`, low to high: how stabs and pads voice it.
  const voiced = (r, iv, lo) =>
    iv
      .map(x => {
        let m = r + x
        while (m < lo) m += 12
        while (m >= lo + 12) m -= 12
        return m
      })
      .sort((a, b) => a - b)
  const panOf = p => [Math.cos(((p + 1) * Math.PI) / 4), Math.sin(((p + 1) * Math.PI) / 4)]
  const resonator = (f, bw) => {
    const r = Math.exp((-Math.PI * bw) / SR)
    return { b1: 2 * r * Math.cos((2 * Math.PI * f) / SR), b2: -r * r, g: 1 - r, y1: 0, y2: 0 }
  }
  const resonate = (res, x) => {
    const y = res.g * x + res.b1 * res.y1 + res.b2 * res.y2
    res.y2 = res.y1
    res.y1 = y
    return y
  }

  // What ducks under the kick: every part but the kick and the dry voice.
  const busL = new Float32Array(N)
  const busR = new Float32Array(N)
  const busSend = new Float32Array(N)
  const toBus = (n, l, r, wet) => {
    if (n < 0 || n >= N) return
    busL[n] += l
    busR[n] += r
    busSend[n] += ((l + r) / 2) * wet
  }

  // The kick: a sine swept down from six times its tail, a click of noise,
  // driven into a square (a little lopsided, for grit), its fizz softened and
  // its tail cut before the next one; muffled by a low-pass when `cutoff` is
  // set, driven harder with a higher `drive`.
  const kicks = []
  function kick(t0, gain, cutoff = 0, ring = 0.2, drive = 6) {
    kicks.push(t0)
    let tail = mtof(chordAt(t0).r)
    while (tail > 60 * Math.SQRT2) tail /= 2
    while (tail < 60 / Math.SQRT2) tail *= 2
    const start = Math.round(t0 * SR)
    const len = Math.round((ring + 0.12) * SR)
    const soft = 1 - Math.exp((-2 * Math.PI * 5000) / SR)
    const lp = cutoff ? 1 - Math.exp((-2 * Math.PI * cutoff) / SR) : 0
    let ph = 0
    let last = 0
    let dc = 0
    let s = 0
    let l1 = 0
    let l2 = 0
    for (let n = 0; n < len; n++) {
      const t = n / SR
      ph += (2 * Math.PI * tail * (1 + 5 * Math.exp(-t * 30))) / SR
      const body = Math.sin(ph) * (0.4 + 0.6 * Math.exp(-t * 6)) + (rand() * 2 - 1) * Math.exp(-t * 350) * 0.5
      const x = Math.tanh(body * drive + 0.25) - Math.tanh(0.25)
      dc = x - last + 0.998 * dc
      last = x
      s += soft * (dc - s)
      let y = s
      if (lp) {
        l1 += lp * (y - l1)
        l2 += lp * (l1 - l2)
        y = l2
      }
      const env = clamp(t / 0.001) * (t < ring ? 1 : Math.exp(-(t - ring) / 0.03))
      addStereo(start + n, y * env * gain, 0, 0.03)
    }
  }

  function hat(t0, gain, decay, pan = 0.25) {
    const start = Math.round(t0 * SR)
    const [gl, gr] = panOf(pan)
    let p1 = 0
    let p2 = 0
    for (let n = 0; n < decay * 6 * SR; n++) {
      const w = rand() * 2 - 1
      const d1 = w - p1
      const d2 = d1 - p2
      p1 = w
      p2 = d1
      const s = d2 * Math.exp(-n / SR / decay) * gain
      toBus(start + n, s * gl, s * gr, 0.1)
    }
  }

  // Three quick bursts of noise and a tail, around 1.3 kHz.
  function clap(t0, gain) {
    const start = Math.round(t0 * SR)
    const res = resonator(1300, 1100)
    const [gl, gr] = panOf(-0.1)
    for (let n = 0; n < 0.3 * SR; n++) {
      const t = n / SR
      let env = 0
      for (const at of [0, 0.01, 0.021]) if (t >= at) env = Math.max(env, Math.exp(-(t - at) / 0.005))
      if (t >= 0.021) env = Math.max(env, 0.55 * Math.exp(-(t - 0.021) / 0.065))
      const s = resonate(res, rand() * 2 - 1) * env * gain
      toBus(start + n, s * gl, s * gr, 0.35)
    }
  }

  function snare(t0, gain, tone) {
    const start = Math.round(t0 * SR)
    const [gl, gr] = panOf(0.05)
    let prev = 0
    for (let n = 0; n < 0.16 * SR; n++) {
      const t = n / SR
      const w = rand() * 2 - 1
      const hp = w - prev
      prev = w
      const s = (hp * 0.55 * Math.exp(-t * 28) + Math.sin(2 * Math.PI * tone * t) * 0.4 * Math.exp(-t * 35)) * gain
      toBus(start + n, s * gl, s * gr, 0.4)
    }
  }

  function crash(t0, gain) {
    const start = Math.round(t0 * SR)
    const [gl, gr] = panOf(-0.3)
    let prev = 0
    for (let n = 0; n < 2.5 * SR; n++) {
      const t = n / SR
      const w = rand() * 2 - 1
      const s = (w - prev) * Math.exp(-t * 1.8) * gain * clamp(t / 0.005)
      prev = w
      toBus(start + n, s * gl, s * gr, 0.4)
    }
  }

  // Noise through a band that sweeps from 400 Hz to 10 kHz, swelling.
  function riser(t0, t1, gain) {
    const start = Math.round(t0 * SR)
    const end = Math.min(N, Math.round(t1 * SR))
    const res = resonator(400, 200)
    for (let n = start; n < end; n++) {
      const p = (n - start) / (end - start)
      const f = 400 * Math.pow(25, p)
      const r = Math.exp((-Math.PI * 0.5 * f) / SR)
      res.b1 = 2 * r * Math.cos((2 * Math.PI * f) / SR)
      res.b2 = -r * r
      res.g = 1 - r
      const s = resonate(res, rand() * 2 - 1) * p * p * Math.sqrt(f / 400) * gain
      const [gl, gr] = panOf(0.4 * Math.sin(6 * Math.PI * p))
      toBus(n, s * gl, s * gr, 0.5)
    }
  }

  // A chord of detuned saws, struck short (or left to ring for `decay`).
  function stab(t0, midis, gain, decay = 0.1) {
    const start = Math.round(t0 * SR)
    const len = Math.round((decay * 4 + 0.05) * SR)
    const a = 1 - Math.exp((-2 * Math.PI * 3000) / SR)
    for (const midi of midis) {
      for (const cents of [-12, 0, 12]) {
        const f = mtof(midi) * Math.pow(2, cents / 1200)
        const [gl, gr] = panOf(cents / 24)
        let ph = rand()
        let y1 = 0
        let y2 = 0
        for (let n = 0; n < len; n++) {
          const t = n / SR
          ph += f / SR
          if (ph >= 1) ph -= 1
          y1 += a * (2 * ph - 1 - y1)
          y2 += a * (y1 - y2)
          const s = y2 * clamp(t / 0.002) * Math.exp(-t / decay) * gain
          toBus(start + n, s * gl, s * gr, 0.35)
        }
      }
    }
  }

  // The chord held soft: detuned saws, darkened, fading in.
  function pad(t0, t1, midis, gain) {
    const start = Math.round(t0 * SR)
    const end = Math.min(N, Math.round((t1 + 1) * SR))
    const a = 1 - Math.exp((-2 * Math.PI * 1400) / SR)
    for (const midi of midis) {
      for (const cents of [-9, 0, 9]) {
        const f = mtof(midi) * Math.pow(2, cents / 1200)
        const [gl, gr] = panOf(cents / 12)
        let ph = rand()
        let y1 = 0
        let y2 = 0
        for (let n = start; n < end; n++) {
          const t = n / SR
          ph += f / SR
          if (ph >= 1) ph -= 1
          y1 += a * (2 * ph - 1 - y1)
          y2 += a * (y1 - y2)
          const s = y2 * clamp((t - t0) / 0.6) * (t > t1 ? Math.exp(-(t - t1) / 0.3) : 1) * gain
          toBus(n, s * gl, s * gr, 0.6)
        }
      }
    }
  }

  // The hoover: five detuned pulses (the width of each wandering, which makes
  // it growl) and a saw an octave below, swooping up a fifth into the note.
  function hoover(t0, dur, midi, gain) {
    const start = Math.round(t0 * SR)
    const len = Math.round((dur + 0.4) * SR)
    const a = 1 - Math.exp((-2 * Math.PI * 2600) / SR)
    const voices = [-0.22, -0.09, 0, 0.09, 0.22].map((detune, i) => ({ detune, ph: rand(), wob: rand() * 6, pan: panOf((i - 2) * 0.3) }))
    let sub = 0
    let l1 = 0
    let l2 = 0
    let r1 = 0
    let r2 = 0
    for (let n = 0; n < len; n++) {
      const t = n / SR
      const bend = -7 * Math.exp(-t / 0.08) + 0.1 * Math.sin(2 * Math.PI * 5 * t) * clamp((t - 0.3) / 0.4)
      let sl = 0
      let sr = 0
      for (const v of voices) {
        v.ph += mtof(midi + bend + v.detune) / SR
        if (v.ph >= 1) v.ph -= 1
        const width = 0.5 + 0.3 * Math.sin(2 * Math.PI * 0.9 * t + v.wob)
        const s = v.ph < width ? 1 : -1
        sl += s * v.pan[0]
        sr += s * v.pan[1]
      }
      sub += mtof(midi - 12 + bend) / SR
      if (sub >= 1) sub -= 1
      sl += (2 * sub - 1) * 0.8
      sr += (2 * sub - 1) * 0.8
      l1 += a * (sl - l1)
      l2 += a * (l1 - l2)
      r1 += a * (sr - r1)
      r2 += a * (r1 - r2)
      const env = clamp(t / 0.006) * (t > dur ? Math.exp(-(t - dur) / 0.1) : 1) * (gain / 5)
      toBus(start + n, l2 * env, r2 * env, 0.35)
    }
  }

  // The happy piano: a struck string, its harmonics a little stretched and each
  // dying faster than the one below, bright and short.
  function piano(t0, midi, gain, ring = 0.5) {
    const f = mtof(midi)
    const start = Math.round(t0 * SR)
    const len = Math.round((ring + 0.1) * SR)
    const H = Math.min(10, Math.floor(9000 / f))
    const [gl, gr] = panOf(clamp((midi - 66) / 24, -0.5, 0.5))
    const buf = new Float32Array(len)
    for (let h = 1; h <= H; h++) {
      const w = (2 * Math.PI * f * h * Math.sqrt(1 + 0.0004 * h * h)) / SR
      const a = Math.pow(h, -1.1) * (1 + 0.3 * Math.sin(h * 1.7))
      const decay = 2 + 0.6 * h + f / 500
      for (let n = 0; n < len; n++) buf[n] += a * Math.exp((-decay * n) / SR) * Math.min(1, n / (0.002 * SR)) * Math.sin(w * n)
    }
    for (let n = 0; n < len; n++) {
      const x = buf[n] * gain * clamp((len - n) / (0.03 * SR))
      toBus(start + n, x * gl, x * gr, 0.3)
    }
  }

  // The supersaw: seven saws a little apart, spread across, brightly filtered.
  function supersaw(t0, dur, midis, gain) {
    const start = Math.round(t0 * SR)
    const len = Math.round((dur + 0.4) * SR)
    const a = 1 - Math.exp((-2 * Math.PI * 5500) / SR)
    for (const midi of midis) {
      ;[-0.3, -0.18, -0.06, 0, 0.06, 0.18, 0.3].forEach((detune, i) => {
        const f = mtof(midi + detune)
        const [gl, gr] = panOf((i - 3) * 0.25)
        let ph = rand()
        let y1 = 0
        let y2 = 0
        for (let n = 0; n < len; n++) {
          const t = n / SR
          ph += f / SR
          if (ph >= 1) ph -= 1
          y1 += a * (2 * ph - 1 - y1)
          y2 += a * (y1 - y2)
          const x = y2 * clamp(t / 0.01) * (t > dur ? Math.exp(-(t - dur) / 0.12) : 1) * (gain / 7)
          toBus(start + n, x * gl, x * gr, 0.35)
        }
      })
    }
  }

  // The happy bass: a short saw on every off-beat, the chord's root, darkened.
  function bounce(t0, midi, gain) {
    const f = mtof(midi)
    const start = Math.round(t0 * SR)
    const a = 1 - Math.exp((-2 * Math.PI * 900) / SR)
    let ph = 0
    let y1 = 0
    let y2 = 0
    for (let n = 0; n < 0.16 * SR; n++) {
      const t = n / SR
      ph += f / SR
      if (ph >= 1) ph -= 1
      y1 += a * (2 * ph - 1 - y1)
      y2 += a * (y1 - y2)
      const x = y2 * clamp(t / 0.002) * Math.exp(-t / 0.08) * gain
      toBus(start + n, x * 0.7, x * 0.7, 0.05)
    }
  }

  // The acid line: one voice from the bass bar to the last bar, a step every
  // half of the band's beat. R root, O octave, F fifth, T third, S seventh (the
  // fifth an octave up when the chord has none); ! an accent, ~ a slide into
  // the next step, . a rest.
  const ACID = ['R!', 'R', 'O~', 'R', 'F', 'R!', 'O', '.', 'R!', 'O~', 'T', 'R', 'F!', 'O', 'S~', 'R']
  function acid(fromBar, toBar) {
    const t0 = fromBar * BAR
    const t1 = toBar * BAR
    const glide = 1 - Math.exp(-1 / (0.035 * SR))
    const attack = 1 - Math.exp(-1 / (0.002 * SR))
    const release = 1 - Math.exp(-1 / (0.01 * SR))
    const [gl, gr] = panOf(-0.15)
    // The filter's resting cutoff: opening through each verse, opening wide
    // through each break, set for the drops (a little wider in the last) and
    // closing in the outro.
    const cutoffAt = t => {
      const b = t / BAR
      const section = SECTIONS.find(s => b >= s.from && b < s.to) ?? SECTIONS[SECTIONS.length - 1]
      const p = (b - Math.max(section.from, fromBar)) / (section.to - Math.max(section.from, fromBar))
      if (section.part === 'break') return 600 * Math.pow(7, p)
      if (section.part === 'drop') return section === LAST_DROP ? 800 : 650
      if (section.part === 'outro') return 650 * Math.pow(0.35, b - section.from)
      return 200 * Math.pow(4.5, p)
    }
    let index = -1
    let ph = 0
    let f = 110
    let target = 110
    let gate = false
    let accent = false
    let slideIn = false
    let slideOut = false
    let amp = 0
    let fenv = 0
    let y1 = 0
    let y2 = 0
    let y3 = 0
    let y4 = 0
    const end = Math.min(N, Math.round((t1 + 0.2) * SR))
    for (let n = Math.round(t0 * SR); n < end; n++) {
      const t = n / SR
      const k = Math.floor((t - t0) / step)
      if (k !== index && t < t1) {
        index = k
        const token = ACID[k % ACID.length]
        const before = ACID[(k + ACID.length - 1) % ACID.length]
        if (token === '.') {
          gate = false
          slideOut = false
        } else {
          const { r, iv } = chordAt(t)
          const interval = { R: 0, O: 12, F: iv[2], T: iv[1], S: iv[3] ?? 19 }[token[0]]
          target = mtof(r + interval)
          slideIn = gate && before.includes('~')
          if (!slideIn) {
            f = target
            fenv = 1
          }
          accent = token.includes('!')
          slideOut = token.includes('~')
          gate = true
        }
      }
      if (t >= t1) gate = false
      f += (target - f) * glide
      const open = gate && (slideOut || t - t0 - index * step < 0.6 * step)
      amp += ((open ? (accent ? 1 : 0.75) : 0) - amp) * (open ? attack : release)
      fenv *= Math.exp(-1 / ((accent ? 0.09 : 0.16) * SR))
      const drop = isDropAt(t)
      const fc = Math.min(7000, cutoffAt(t) * (1 + (drop ? 5 : 2.5) * fenv * (accent ? 1.6 : 1)))
      const g = Math.min(0.6, 1 - Math.exp((-2 * Math.PI * fc) / SR))
      const k4 = drop ? (t >= LAST_DROP.from * BAR ? 3.55 : 3.4) : 3.1
      // A saw with its corners rounded (polyBLEP), so it does not alias.
      const dt = f / SR
      ph += dt
      if (ph >= 1) ph -= 1
      let saw = 2 * ph - 1
      if (ph < dt) {
        const x = ph / dt
        saw -= x + x - x * x - 1
      } else if (ph > 1 - dt) {
        const x = (ph - 1) / dt
        saw -= x * x + x + x + 1
      }
      const u = saw - k4 * Math.tanh(y4)
      y1 += g * (Math.tanh(u) - y1)
      y2 += g * (y1 - y2)
      y3 += g * (y2 - y3)
      y4 += g * (y3 - y4)
      const s = Math.tanh(y4 * 2.2) * amp * 0.16
      toBus(n, s * gl, s * gr, 0.15)
    }
  }

  // The kick: muffled from the heartbeat bar, opening on the way to the drums;
  // out in the breaks; in the last drop driven harder, and rolling at the end
  // of every second bar, the last two beats in halves (POM-POM-POM-POM); one
  // last kick on the last bar, left to ring.
  for (let bar = HEARTBEAT_BAR; bar < OUTRO_BAR; bar++) {
    if (isBreak(bar)) continue
    const biggest = isLastDrop(bar) && DROPS.length > 1
    const rolls = biggest && (bar - LAST_DROP.from) % 2 === 1
    for (let i = 0; i < pulses; i++) {
      const t = bar * BAR + i * PULSE
      if (rolls && i >= pulses - 2) {
        kick(t, 0.56, 0, 0.06, HARD(bar))
        kick(t + PULSE / 2, 0.56, 0, 0.06, HARD(bar))
        continue
      }
      const p = bar < DRUMS_BAR ? (t - HEARTBEAT_BAR * BAR) / ((DRUMS_BAR - HEARTBEAT_BAR) * BAR) : 1
      kick(t, biggest ? 0.58 : 0.5, p < 1 ? 160 * Math.pow(40, p * p) : 0, hardAt(bar) ? 0.2 : 0.17, biggest ? HARD(bar) : DRIVE(bar))
    }
  }
  kick(LAST_BAR * BAR, 0.55, 0, 0.6, DRIVE(LAST_BAR))

  // Hats off the beat from the drums bar, quicker closed ones in the drops;
  // claps on the backbeat from the pad bar.
  for (let bar = DRUMS_BAR; bar < OUTRO_BAR; bar++) {
    if (isBreak(bar)) continue
    const drop = isDrop(bar)
    for (let i = 0; i < pulses; i++) {
      const t = bar * BAR + i * PULSE
      hat(t + PULSE / 2, drop ? 0.09 : 0.07, 0.06)
      const biggest = isLastDrop(bar) && DROPS.length > 1
      if (drop) {
        hat(t + PULSE / 4, biggest ? 0.045 : 0.03, 0.015, -0.25)
        hat(t + (3 * PULSE) / 4, biggest ? 0.045 : 0.03, 0.015, -0.25)
      }
      if (bar >= PAD_BAR && i % 2 === 1) clap(t, biggest ? 0.25 : drop ? 0.2 : 0.16)
    }
  }
  if (DRUMS_BAR > HEARTBEAT_BAR) crash(DRUMS_BAR * BAR, 0.08)
  for (const drop of DROPS) crash(drop.from * BAR, 0.14)
  crash(LAST_BAR * BAR, 0.1)

  // The end of each break: a snare roll in its last bar, in eighths of the
  // band's beat, then sixteenths, then thirty-seconds, rising; a riser from
  // the middle of the bar before.
  for (const { part, to } of SECTIONS) {
    if (part !== 'break') continue
    const from = (to - 1) * BAR
    for (let t = from; t < from + BAR - 1e-6; ) {
      const p = (t - from) / BAR
      snare(t, 0.08 + 0.22 * p, 180 + 220 * p)
      t += PULSE / (p < 0.5 ? 2 : p < 0.75 ? 4 : 8)
    }
    riser(from - BAR / 2, from + BAR, 0.05)
  }

  // The pad in the intro and in the breaks; stabs from the pad bar, in threes
  // and twos (3 + 3 + 2 steps), but in the breaks; the hoover in the drops and
  // the outro; the acid line.
  SEGMENTS.forEach(({ name, beats, t0, bar }) => {
    const [r, iv] = CHORD[name]
    if (bar < INTRO_BARS || isBreak(bar)) pad(t0, t0 + beats * BEAT, voiced(r, iv, 60), isBreak(bar) ? 0.05 : 0.02)
    if ((isDrop(bar) || bar >= OUTRO_BAR) && bar < LAST_BAR) {
      const biggest = isLastDrop(bar) && DROPS.length > 1
      if (HAPPY) supersaw(t0, beats * BEAT - 0.02, voiced(r, iv, 64), biggest ? 0.06 : 0.045)
      // The hoover: the rave band's, and the happy one's in its last drop once turned hard.
      if (!HAPPY || (hardAt(bar) && biggest)) {
        hoover(t0, beats * BEAT - 0.02, r + 12, 0.07)
        if (biggest) hoover(t0, beats * BEAT - 0.02, r + 24, 0.05)
      }
    }
  })
  for (let bar = PAD_BAR; bar < LAST_BAR; bar++) {
    if (isBreak(bar)) continue
    for (const s of [0, 3, 6, 8, 11, 14]) {
      const t = bar * BAR + s * step
      if (t >= (bar + 1) * BAR - 1e-6) continue
      const { r, iv } = chordAt(t)
      const loud = isDrop(bar) || bar >= OUTRO_BAR
      if (HAPPY) for (const m of voiced(r, iv, 60)) piano(t, m, loud ? 0.07 : 0.055)
      else stab(t, voiced(r, iv, 60), loud ? 0.05 : 0.04)
    }
  }
  {
    const { r, iv } = chordAt(LAST_BAR * BAR)
    if (HAPPY) {
      for (const m of [...voiced(r, iv, 60), r + 24]) piano(LAST_BAR * BAR, m, 0.08, 2.5)
      supersaw(LAST_BAR * BAR, BAR + TAIL - 1.2, voiced(r, iv, 64), 0.05)
      if (hardAt(LAST_BAR)) hoover(LAST_BAR * BAR, BAR + TAIL - 1.2, r + 12, 0.06)
    } else {
      stab(LAST_BAR * BAR, voiced(r, iv, 60), 0.05, 0.6)
      hoover(LAST_BAR * BAR, BAR + TAIL - 1.2, r + 12, 0.07)
    }
  }
  if (!HAPPY) acid(BASS_BAR, LAST_BAR)
  else {
    // The happy bass, off every beat the band plays from the bass bar, but in
    // the breaks; the acid line instead from the bar the band turns hard.
    const HARD_BAR = Math.max(BASS_BAR, SONG.hardFrom ?? LAST_BAR)
    for (let bar = BASS_BAR; bar < Math.min(LAST_BAR, HARD_BAR); bar++) {
      if (isBreak(bar)) continue
      for (let i = 0; i < pulses; i++) {
        const t = bar * BAR + i * PULSE + PULSE / 2
        bounce(t, chordAt(t).r, isDrop(bar) ? 0.2 : 0.16)
      }
    }
    if (HARD_BAR < LAST_BAR) acid(HARD_BAR, LAST_BAR)
  }

  // The voice again a dotted eighth later on the left, and twice that on the right.
  {
    const delay = Math.round(0.75 * PULSE * SR)
    const [al, ar] = panOf(-0.7)
    const [bl, br] = panOf(0.7)
    for (let n = delay; n < N; n++) {
      const first = voc[n - delay] * 0.22
      const second = n >= 2 * delay ? voc[n - 2 * delay] * 0.1 : 0
      toBus(n, first * al + second * bl, first * ar + second * br, 0.4)
    }
  }

  // The pump: everything on the bus dips under each kick and is back before
  // the next; deeper in the last drop.
  kicks.sort((a, b) => a - b)
  let last = -1
  for (let n = 0; n < N; n++) {
    const t = n / SR
    while (last + 1 < kicks.length && kicks[last + 1] <= t) last++
    const since = last >= 0 ? t - kicks[last] : Infinity
    const depth = DROPS.length > 1 && t >= LAST_DROP.from * BAR && t < LAST_DROP.to * BAR ? 0.7 : 0.55
    const duck = 1 - depth * clamp(since / 0.003) * Math.exp(-since / 0.075)
    L[n] += busL[n] * duck
    Rt[n] += busR[n] * duck
    send[n] += busSend[n] * duck
  }
}

ORCHESTRA_BANDS[ORCHESTRA]()

// How loud the band is under each line before the voice joins it, to compare
// with voiceByLine across songs.
const bandByLine = lines.map(line => {
  let ss = 0
  const from = Math.round(line.start * SR)
  const to = Math.round(line.end * SR)
  for (let n = from; n < to; n++) ss += ((L[n] + Rt[n]) / 2) ** 2
  return +Math.sqrt(ss / Math.max(1, to - from)).toFixed(3)
})

// vocal with a light chorus for Claude's synthetic shine
for (let n = 0; n < N; n++) {
  const t = n / SR
  const d1 = (0.014 + 0.0018 * Math.sin(2 * Math.PI * 0.31 * t)) * SR
  const d2 = (0.021 + 0.0018 * Math.sin(2 * Math.PI * 0.23 * t + 1)) * SR
  const c1 = voc[Math.max(0, Math.floor(n - d1))]
  const c2 = voc[Math.max(0, Math.floor(n - d2))]
  const s = voc[n]
  L[n] += s * 0.9 + c1 * 0.32
  Rt[n] += s * 0.9 + c2 * 0.32
  send[n] += s * 0.55
}

// ---------- reverb (Freeverb style) ----------
function reverb(input, offset) {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map(d => ({ buf: new Float32Array(d + offset), i: 0, store: 0 }))
  const aps = [556, 441, 341, 225].map(d => ({ buf: new Float32Array(d + offset), i: 0 }))
  const out = new Float32Array(input.length)
  for (let n = 0; n < input.length; n++) {
    const x = input[n] * 0.015
    let s = 0
    for (const c of combs) {
      const y = c.buf[c.i]
      c.store = y * 0.7 + c.store * 0.3
      c.buf[c.i] = x + c.store * 0.86
      if (++c.i >= c.buf.length) c.i = 0
      s += y
    }
    for (const a of aps) {
      const b = a.buf[a.i]
      a.buf[a.i] = s + b * 0.5
      if (++a.i >= a.buf.length) a.i = 0
      s = b - s
    }
    out[n] = s
  }
  return out
}
const wetL = reverb(send, 0)
const wetR = reverb(send, 23)
for (let n = 0; n < N; n++) { L[n] += wetL[n] * 2.2; Rt[n] += wetR[n] * 2.2 }

// ---------- master ----------
let peak = 0
for (let n = 0; n < N; n++) peak = Math.max(peak, Math.abs(L[n]), Math.abs(Rt[n]))
// A song may ask to be louder (`masterGain`, in dB, 0 when absent): its peaks
// then go into the soft clipping below instead of setting the whole level.
const byPeak = (1.05 / peak) * Math.pow(10, (SONG.masterGain ?? 0) / 20)
// A song may instead ask for a set level (`masterLevel`, in dBFS, measured over
// the bars between its intro and its outro as it will be written): every
// profile and voice of it then comes out equally loud, so they compare by sound
// and not by level. The gain is found by halving the gap; the soft clipping
// keeps the peaks in.
function levelGain(target) {
  const from = Math.round(INTRO_BARS * BAR * SR)
  const to = Math.min(N, Math.round(OUTRO_BAR * BAR * SR))
  const rmsAt = g => {
    let ss = 0
    let count = 0
    for (let n = from; n < to; n += 4) {
      const l = Math.tanh(L[n] * g) * 0.93
      const r = Math.tanh(Rt[n] * g) * 0.93
      ss += l * l + r * r
      count += 2
    }
    return Math.sqrt(ss / count)
  }
  const goal = Math.pow(10, target / 20)
  let lo = byPeak / 10
  let hi = byPeak * 10
  for (let i = 0; i < 40; i++) {
    const mid = Math.sqrt(lo * hi)
    if (rmsAt(mid) < goal) lo = mid
    else hi = mid
  }
  return Math.sqrt(lo * hi)
}
if (SONG.masterLevel !== undefined && SONG.masterGain !== undefined) throw new Error('a song sets masterLevel or masterGain, not both: masterLevel decides the whole level')
const gain = SONG.masterLevel === undefined ? byPeak : levelGain(SONG.masterLevel)
const fadeFrom = N - Math.round(1.5 * SR)
const pcm = Buffer.alloc(N * 4)
let nonFinite = 0
for (let n = 0; n < N; n++) {
  const fade = n > fadeFrom ? 1 - (n - fadeFrom) / (N - fadeFrom) : 1
  const fadeIn = clamp(n / (0.01 * SR))
  let l = Math.tanh(L[n] * gain) * 0.93 * fade * fadeIn
  let r = Math.tanh(Rt[n] * gain) * 0.93 * fade * fadeIn
  if (!Number.isFinite(l) || !Number.isFinite(r)) { nonFinite++; l = 0; r = 0 }
  pcm.writeInt16LE(Math.round(l * 32767), n * 4)
  pcm.writeInt16LE(Math.round(r * 32767), n * 4 + 2)
}
const header = Buffer.alloc(44)
header.write('RIFF', 0)
header.writeUInt32LE(36 + pcm.length, 4)
header.write('WAVE', 8)
header.write('fmt ', 12)
header.writeUInt32LE(16, 16)
header.writeUInt16LE(1, 20)
header.writeUInt16LE(2, 22)
header.writeUInt32LE(SR, 24)
header.writeUInt32LE(SR * 4, 28)
header.writeUInt16LE(4, 32)
header.writeUInt16LE(16, 34)
header.write('data', 36)
header.writeUInt32LE(pcm.length, 40)
fs.writeFileSync(OUT_WAV, Buffer.concat([header, pcm]))

const timing = {
  bpm: BPM,
  beat: +BEAT.toFixed(5),
  // The beat the band plays, for the stage to move to: only in double time.
  ...(SONG.doubleTime ? { pulse: +PULSE.toFixed(5) } : {}),
  bar: +BAR.toFixed(5),
  duration: +DURATION.toFixed(3),
  outroAt: +OUTRO_AT.toFixed(3),
  // The last line before the first drop, and the first line in it.
  bloomAt: lines[LINES.findLastIndex(line => line.bar < DROPS[0].from)].start,
  finaleAt: lines[LINES.findIndex(line => line.bar >= DROPS[0].from)].start,
  // When the bass and the drums (or the heartbeat before them) enter, for the
  // stage to follow: only for a song with a build of its own.
  ...(SONG.build ? { bassAt: +(BASS_BAR * BAR).toFixed(3), drumsAt: +(HEARTBEAT_BAR * BAR).toFixed(3) } : {}),
  // The sections, for the stage to follow: only for a song with a form of its own.
  ...(SONG.form ? { sections: SECTIONS.map(({ part, from, to }) => ({ part, start: +(from * BAR).toFixed(3), end: +(to * BAR).toFixed(3) })) } : {}),
  lines,
}
fs.writeFileSync(OUT_JSON, JSON.stringify(timing, null, 2))

// How loud the voice is against the band, line by line, to check the mix.
const rms = (a, from, to) => { let s = 0; for (let n = from; n < to; n++) s += a[n] * a[n]; return Math.sqrt(s / Math.max(1, to - from)) }
console.log(JSON.stringify({
  voice: VOICE,
  profile: PROFILE,
  lostInClassico: ADVANCED ? [] : lostInClassico,
  seconds: +DURATION.toFixed(1),
  syllables: syllables.length,
  vref: +VREF.toFixed(4),
  nonFinite,
  loudestSyllables: [...peaks].sort((a, b) => b.peak - a.peak).slice(0, 4),
  voiceByLine: lines.map(l => +rms(voc, Math.round(l.start * SR), Math.round(l.end * SR)).toFixed(3)),
  bandByLine,
}))
