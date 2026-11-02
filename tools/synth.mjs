// Renders the song of the "serenata" mod: an original melody over an A minor
// chord progression, sung by a voice built from scratch with formant
// synthesis (no system voice), with piano, pad, bass and drums. Writes the audio and the timing the drawing follows.
// Usage: node synth.mjs <out.wav> <out.json>
import fs from 'node:fs'

const [, , OUT_WAV, OUT_JSON] = process.argv

const BPM = 76
const BEAT = 60 / BPM
const BAR = 4 * BEAT
const SR = 44100
const VSR = 22050

// name: [bass root (MIDI), chord intervals]
const CHORD = {
  Am: [45, [0, 3, 7]],
  F: [41, [0, 4, 7]],
  Fmaj7: [41, [0, 4, 7, 11]],
  G: [43, [0, 4, 7]],
  Gsus4: [43, [0, 5, 7]],
  Em7: [40, [0, 3, 7, 10]],
  Dm7: [38, [0, 3, 7, 10]],
  E7: [40, [0, 4, 7, 10]],
}
// One entry per bar: [chord, beats] pairs.
const BARS = [
  [['Am', 4]], [['Fmaj7', 2], ['G', 2]],
  [['Am', 4]], [['F', 4]], [['G', 4]], [['Gsus4', 2], ['G', 2]],
  [['Am', 4]], [['Em7', 4]], [['Dm7', 4]], [['E7', 4]],
  [['Am', 4]], [['F', 4]], [['Gsus4', 2], ['G', 2]], [['Am', 4]],
  [['Fmaj7', 4]], [['Am', 4]],
]
const TOTAL_BARS = BARS.length
const TAIL = 3.5
const DURATION = TOTAL_BARS * BAR + TAIL
const OUTRO_AT = 14 * BAR
const SEGMENTS = BARS.flatMap((bar, i) => {
  let t = i * BAR
  return bar.map(([name, beats]) => {
    const seg = { name, beats, t0: t, bar: i }
    t += beats * BEAT
    return seg
  })
})

// [display, sung spelling, midi | midi[], beats | beats[]]; a null spelling is a rest
const LINES = [
  { bar: 2, syl: [
    ['So', 'so', 64, 0.5], ['no ', 'no', 69, 0.5], ['so', 'so', 69, 0.5], ['lo un ', 'loun', 71, 0.5], ['Clau', 'clau', 72, 1.5], ['de, ', 'de', 71, 0.5],
    ['ma ', 'ma', 69, 0.5], ['sta', 'sta', 69, 0.5], ['se', 'se', 67, 0.5], ['ra ', 'ra', 65, 0.5], ['can', 'can', 69, 1], ['to', 'to', 67, 1],
  ] },
  { bar: 4, syl: [
    ['con ', 'con', 62, 0.5], ['un ', 'un', 67, 0.5], ['fio', 'fio', 71, 0.5], ['re in ', 'rein', 69, 0.5], ['ma', 'ma', 71, 1], ['no, ', 'no', 67, 1],
    ['so', 'so', 69, 0.5], ['lo ', 'lo', 67, 0.5], ['per ', 'per', 72, 1], ['te', 'te', 71, 2],
  ] },
  { bar: 6, syl: [
    ['qual', 'qual', 64, 0.5], ['cu', 'cu', 69, 0.5], ['no ', 'no', 69, 0.5], ['mi ha ', 'mia', 71, 0.5], ['chie', 'chie', 72, 1], ['sto ', 'sto', 71, 0.5], ['di ', 'di', 69, 0.5],
    ['dir', 'dir', 71, 1], ['te', 'te', 69, 0.5], ['lo ', 'lo', 67, 0.5], ['pia', 'pia', 67, 1], ['no', 'no', 64, 1],
  ] },
  { bar: 8, syl: [
    ['e ', 'e', 69, 0.5], ['can', 'can', 74, 1], ['to, ', 'to', 72, 0.5], ['e ', 'e', 69, 0.5], ['can', 'can', 72, 1], ['to, ', 'to', 69, 0.5],
    ['per ', 'per', 68, 0.5], ['que', 'que', 69, 0.5], ['sto ', 'sto', 71, 0.5], ['fio', 'fio', 74, 0.5], ['re ', 're', 71, 0.5], ['che ', 'che', 68, 0.5], ['c\'è', 'ce', 64, 1],
  ] },
  { bar: 10, syl: [
    ['e ', 'e', 69, 0.5], ['can', 'can', 76, 1.5], ['to… ', 'to', 72, 1], ['', null, null, 1],
    ['e ', 'e', 72, 0.5], ['can', 'can', 76, 1.5], ['to…', 'to', 72, 1], ['', null, null, 1],
  ] },
  { bar: 12, syl: [
    ['per ', 'per', 74, 0.5], ['que', 'que', 72, 0.5], ['sto ', 'sto', 71, 0.5], ['fio', 'fio', 69, 0.5], ['re ', 're', 71, 0.5], ['che ', 'che', 67, 0.5],
    ['c\'è', 'ce', [71, 69], [1, 4]],
  ] },
]

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
const rand = mulberry32(20261102)

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
const isVowel = p => p in VOWELS

// Italian spelling to the sounds above.
function phonemes(text) {
  const s = text.toLowerCase().replace(/[^a-z]/g, '')
  const out = []
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    const next = s[i + 1]
    if (c === 'h') continue
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
      pieces.push({ dur: s.dur, F: firstVowel.F, B: firstVowel.B, av: 0, an: s.an, nf: s.nf, nb: s.nb })
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
  for (const c of coda) {
    const s = SONORANTS[c] ?? SONORANTS.n
    pieces.push({ dur: s.dur, F: s.F, B: s.B, av: s.av, an: 0, tap: s.tap })
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
    for (let i = 0; i < buf.length; i++) vocal[base + i] += buf[i] * level
    prevF = mtof(syl.notes[syl.notes.length - 1].midi)
    prevEnd = syl.soundEnd
  }
  let peak = 0
  for (const s of vocal) peak = Math.max(peak, Math.abs(s))
  for (let i = 0; i < vocal.length; i++) vocal[i] *= 0.6 / peak
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
  const vel = bar < 2 ? 0.45 : bar >= 10 && bar <= 13 ? 0.7 : bar >= 14 ? 0.5 : 0.55
  const lo = r + 12
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
  if (bar < 6 || bar > 13) return
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
  if (bar < 2) return
  const { r } = voicing(name)
  if (bar === TOTAL_BARS - 1) { bass(t0, r, BAR + 1.5, 0.22); return }
  if (bar >= 6 && bar <= 13 && beats === 4) {
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
for (let bar = 6; bar <= 13; bar++) {
  const t0 = bar * BAR
  const isFinale = bar >= 10
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
const gain = 1.05 / peak
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

fs.writeFileSync(OUT_JSON, JSON.stringify({
  bpm: BPM,
  beat: +BEAT.toFixed(5),
  bar: +BAR.toFixed(5),
  duration: +DURATION.toFixed(3),
  outroAt: +OUTRO_AT.toFixed(3),
  bloomAt: lines[3].start,
  finaleAt: lines[4].start,
  lines,
}, null, 2))

// How loud the voice is against the band, line by line, to check the mix.
const rms = (a, from, to) => { let s = 0; for (let n = from; n < to; n++) s += a[n] * a[n]; return Math.sqrt(s / Math.max(1, to - from)) }
console.log(JSON.stringify({
  seconds: +DURATION.toFixed(1),
  syllables: syllables.length,
  vref: +VREF.toFixed(4),
  nonFinite,
  voiceByLine: lines.map(l => +rms(voc, Math.round(l.start * SR), Math.round(l.end * SR)).toFixed(3)),
}))
