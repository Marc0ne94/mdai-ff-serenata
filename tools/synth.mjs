// The engine of the "serenata" mod's songs: renders a song file of tools/songs
// with a voice built from scratch with formant synthesis (no system voice),
// played by a band of its orchestra (see ORCHESTRA). Writes the audio and the timing the drawing follows.
// Every song has the same 16-bar form, which the stage in hooks/scene.ts follows:
// intro (bars 0-1), bass from bar 2, drums and pad from bar 6, finale 10-13,
// outro 14-15; six sung lines of two bars each, from bar 2. What a song chooses:
// its tempo, chords, melody and words, and the seed of its noise; a song may
// also build up its own way (`build`: when bass, pad and drums enter).
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
const { orchestra: ORCHESTRA, lyre: LYRE } = PROFILES[PROFILE]

const BPM = SONG.bpm
const BEAT = 60 / BPM
const BAR = 4 * BEAT
const SR = 44100
const VSR = 22050

const CHORD = SONG.chords
const BARS = SONG.bars
const LINES = SONG.lines
if (BARS.length !== 16) throw new Error(`a song has 16 bars, not ${BARS.length}`)
if (LINES.length !== 6) throw new Error(`a song has 6 lines, not ${LINES.length}`)
// Numbers the engine computes with: a missing or wrong one would render silence.
const isNumber = x => typeof x === 'number' && Number.isFinite(x)
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
LINES.forEach((line, i) => {
  if (line.bar !== 2 + 2 * i) throw new Error(`line ${i + 1} starts at bar ${2 + 2 * i}, not ${line.bar}`)
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

const TOTAL_BARS = BARS.length
const TAIL = 3.5
const DURATION = TOTAL_BARS * BAR + TAIL
const OUTRO_AT = 14 * BAR
// A song may ask for a progressive build (`build`, bars): when the bass, the
// pad and the drums enter, a heartbeat (kick alone) before the drums, and the
// bar from which the piano plays its full arpeggio (sparser before it). The
// defaults are the fixed form every other song plays.
const BUILD = SONG.build ?? {}
const BASS_BAR = BUILD.bass ?? 2
const PAD_BAR = BUILD.pad ?? 6
const DRUMS_BAR = BUILD.drums ?? 6
const HEARTBEAT_BAR = BUILD.heartbeat ?? DRUMS_BAR
const PIANO_BAR = BUILD.piano ?? 0
for (const [part, bar] of Object.entries(BUILD)) {
  if (!['bass', 'pad', 'drums', 'heartbeat', 'piano'].includes(part)) throw new Error(`build: no part ${part} (bass, pad, drums, heartbeat, piano)`)
  if (!Number.isInteger(bar) || bar < 0 || bar > 13) throw new Error(`build: ${part} enters at a bar from 0 to 13, not ${JSON.stringify(bar)}`)
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
    let vel = bar < 2 ? 0.45 : bar >= 10 && bar <= 13 ? 0.7 : bar >= 14 ? 0.5 : 0.55
    const lo = r + 12
    if (bar < PIANO_BAR) {
      // Before the full arpeggio: the root and a broken chord, three notes a
      // bar in the intro, a quarter-note climb after, growing louder bar by bar.
      vel = 0.3 + 0.25 * (bar / PIANO_BAR)
      const climb = [lo, lo + fifth, lo + 12, lo + 12 + third]
      const beatsOf = bar < 2 ? [0, 2, 3] : [0, 1, 2, 3]
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

  // pad (bars 6..13)
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
    if (bar < PAD_BAR || bar > 13) return
    const { r, third, fifth, seventh } = voicing(name)
    pad(t0, t0 + beats * BEAT, [r + 12, r + 12 + third, r + 12 + fifth, r + 12 + (seventh ?? 12)], bar >= 10 ? 0.05 : 0.03)
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
    if (bar >= DRUMS_BAR && bar <= 13 && beats === 4) {
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
  for (let bar = HEARTBEAT_BAR; bar <= 13; bar++) {
    const t0 = bar * BAR
    const isFinale = bar >= 10
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
  crash(10 * BAR, 0.12)
  crash(13 * BAR, 0.08)

  // a soft lead doubling the melody, and bells in the finale
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
      if (note.start >= 10 * BAR && note.start < 14 * BAR) {
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
        const swell = 0.4 + 0.6 * smoothstep(clamp((t - 2 * BAR + 1) / 3))
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
    const vel = bar < 2 ? 0.45 : bar >= 10 && bar <= 13 ? 0.6 : bar >= 14 ? 0.5 : 0.48
    const lo = r + 12
    if (bar === TOTAL_BARS - 1) {
      ;[r, lo, lo + fifth, lo + 12, lo + 12 + third, lo + 12 + fifth, lo + 24].forEach((m, i) => lyre(t0 + i * 0.09, m, 0.5, (i - 3) * 0.12, BAR + TAIL - 0.5))
      return
    }
    const pattern = [lo, lo + fifth, lo + 12, lo + 12 + third, lo + 12 + fifth, lo + 12 + third, lo + 12, lo + fifth]
    for (let i = 0; i < beats * 2; i++) lyre(t0 + (i * BEAT) / 2, pattern[i % 8], vel * (i === 0 ? 1 : 0.7), clamp((pattern[i % 8] - 62) / 24, -0.5, 0.5))
    if (bar >= 2) lyre(t0, r, vel * 0.9, 0, 2.8)
  })

  // The choir from bar 6 to bar 13, louder in the finale.
  SEGMENTS.forEach(({ name, beats, t0, bar }) => {
    if (bar < 6 || bar > 13) return
    const { r, third, fifth } = chordOf(name)
    choir(t0, t0 + beats * BEAT, [r + 12, r + 12 + third, r + 12 + fifth], bar >= 10 ? 0.012 : 0.008)
  })

  // Frame drums from bar 6: doum and tek, busier in the finale, with a jingle.
  for (let bar = 6; bar <= 13; bar++) {
    const t0 = bar * BAR
    const isFinale = bar >= 10
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
  // The accents of the finale and of its last bar: a roll of the jingle over
  // the doum already there (a second doum on it would set the song's peak).
  for (const t of [10 * BAR, 13 * BAR]) {
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
  tune(SONG.reed?.outro ?? [], 14)
  for (const syl of syllables) {
    syl.notes.forEach(note => reed(note.start, note.midi, Math.min(note.dur, syl.soundEnd - note.start), 0.035, -0.1))
  }
}

ORCHESTRA_BANDS[ORCHESTRA]()

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
// its sung bars 2-14 as it will be written): every profile and voice of it then
// comes out equally loud, so they compare by sound and not by level. The gain
// is found by halving the gap; the soft clipping keeps the peaks in.
function levelGain(target) {
  const from = Math.round(2 * BAR * SR)
  const to = Math.min(N, Math.round(14 * BAR * SR))
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
  bar: +BAR.toFixed(5),
  duration: +DURATION.toFixed(3),
  outroAt: +OUTRO_AT.toFixed(3),
  bloomAt: lines[3].start,
  finaleAt: lines[4].start,
  // When the bass and the drums (or the heartbeat before them) enter, for the
  // stage to follow: only for a song with a build of its own.
  ...(SONG.build ? { bassAt: +(BASS_BAR * BAR).toFixed(3), drumsAt: +(HEARTBEAT_BAR * BAR).toFixed(3) } : {}),
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
}))
