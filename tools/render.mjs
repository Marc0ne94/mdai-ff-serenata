// Renders a song of tools/songs in every sound profile and voice style it
// declares in `audio`: the audio of each pair (the path it names) and
// hooks/songs/<song>.ts, the timing the stage follows and the pairs the band offers.
//
// An audio file is encoded again only when what it was encoded from changed:
// the encoder writes a different file from the same sound, so the module
// keeps the fingerprint of each style's sound, and an unchanged one keeps its file.
// A song whose file and tools have not changed since its module was written is
// not rendered again (--force renders it anyway).
// Before anything, no audio file may be named by two songs. Every run then
// checks the whole audio/ folder against every song of tools/songs: a file a
// song names and is missing, or a file no song names, is an error (exit code 1).
// --force also encodes every file again.
// Usage: node tools/render.mjs tools/songs/<song>.mjs [--force]
import { execFileSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { PROFILES as PROFILE_DEFS, STYLES } from './profiles.mjs'

// The sound profiles, in the order the menu shows them.
const PROFILES = Object.keys(PROFILE_DEFS)
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FORCE = process.argv.includes('--force')
const [SONG_FILE] = process.argv.slice(2).filter(arg => arg !== '--force')
if (!SONG_FILE) throw new Error('usage: node tools/render.mjs tools/songs/<song>.mjs [--force]')
const name = path.basename(SONG_FILE, '.mjs')
const song = (await import(pathToFileURL(path.resolve(SONG_FILE)).href)).default
const audio = song.audio ?? {}
for (const profile of Object.keys(audio)) if (!PROFILES.includes(profile)) throw new Error(`${name}: no sound profile ${profile}`)
// Every pair the song declares, profiles and styles in the menus' order.
const pairs = []
for (const profile of PROFILES.filter(p => p in audio)) {
  const voices = audio[profile] ?? {}
  for (const style of Object.keys(voices)) if (!STYLES.includes(style)) throw new Error(`${name}: ${profile} has no voice style ${style}`)
  for (const style of STYLES.filter(s => s in voices)) {
    if (!/^audio\/[a-z0-9-]+\.m4a$/.test(voices[style])) throw new Error(`${name}: ${profile} ${style} names ${voices[style]}, not audio/<name>.m4a`)
    pairs.push({ profile, style, asset: voices[style] })
  }
}
if (pairs.length === 0) throw new Error(`${name}: declares no sound profile with a voice style`)
const assets = pairs.map(p => p.asset)
if (new Set(assets).size !== assets.length) throw new Error(`${name}: two pairs name the same audio file`)

// Which song names each audio file: one song per file, or two would overwrite each other.
const owners = new Map()
const songsDir = path.join(ROOT, 'tools', 'songs')
for (const file of fs.readdirSync(songsDir).filter(f => f.endsWith('.mjs')).sort()) {
  const spec = (await import(pathToFileURL(path.join(songsDir, file)).href)).default
  for (const voices of Object.values(spec.audio ?? {})) {
    for (const asset of Object.values(voices ?? {})) {
      if (owners.has(asset) && owners.get(asset) !== file) throw new Error(`${asset} is named by both ${owners.get(asset)} and ${file}`)
      owners.set(asset, file)
    }
  }
}
const fileSha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')

const moduleFile = path.join(ROOT, 'hooks', 'songs', `${name}.ts`)
// What each audio file was encoded from, as the module last written says.
const previous = fs.existsSync(moduleFile) ? fs.readFileSync(moduleFile, 'utf8') : ''
// What each audio file was encoded from (its sound), and the file it was then.
const encodedFrom = {}
for (const [, asset, wav, m4a] of previous.matchAll(/^\/\/ source (\S+) (\w{64})(?: (\w{64}))?$/gm)) encodedFrom[asset] = { wav, m4a }
// A file is as it was encoded when it is there and, if the module knows it, the same to the byte.
const isAsEncoded = asset => {
  const target = path.join(ROOT, asset)
  const record = encodedFrom[asset]
  return Boolean(record) && fs.existsSync(target) && (!record.m4a || record.m4a === fileSha(target))
}

// What the module is built from: the song's file and the tools that render it.
const built = crypto.createHash('sha256')
for (const file of [path.resolve(SONG_FILE), ...['synth.mjs', 'profiles.mjs', 'render.mjs'].map(f => path.join(ROOT, 'tools', f))]) {
  built.update(fs.readFileSync(file))
}
const buildHash = built.digest('hex')
const isUnchanged = !FORCE && previous.includes(`// built ${buildHash}`) && pairs.every(p => isAsEncoded(p.asset))

const report = []
let timing = null
let timingText = null
const sources = {}
if (isUnchanged) {
  for (const { profile, style, asset } of pairs) {
    sources[asset] = encodedFrom[asset]
    report.push({ profile, style, asset, sound: encodedFrom[asset].wav.slice(0, 16), audio: 'unchanged' })
  }
} else {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'serenata-'))
  try {
    for (const { profile, style, asset } of pairs) {
      const wav = path.join(work, `${profile}-${style}.wav`)
      const json = path.join(work, `${profile}-${style}.json`)
      const out = execFileSync(process.execPath, [path.join(ROOT, 'tools', 'synth.mjs'), SONG_FILE, wav, json, style, profile], { encoding: 'utf8' })
      const summary = JSON.parse(out.trim().split('\n').pop())
      if (summary.nonFinite > 0) throw new Error(`${name}: ${profile} ${style} has ${summary.nonFinite} samples that are not numbers`)
      const text = fs.readFileSync(json, 'utf8')
      // Every pair follows the same notes: one timing, or something is wrong.
      if (timingText !== null && text !== timingText) throw new Error(`${name}: ${profile} ${style} has a timing of its own`)
      timingText = text
      timing = JSON.parse(text)
      const sha = crypto.createHash('sha256').update(fs.readFileSync(wav)).digest('hex')
      const target = path.join(ROOT, asset)
      const isKept = !FORCE && encodedFrom[asset]?.wav === sha && isAsEncoded(asset)
      if (!isKept) execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '192000', wav, target])
      sources[asset] = { wav: sha, m4a: fileSha(target) }
      report.push({ profile, style, asset, sound: sha.slice(0, 16), audio: isKept ? 'kept' : 'encoded', lostInClassico: summary.lostInClassico, loudest: summary.loudestSyllables?.[0] })
    }
  } finally {
    fs.rmSync(work, { recursive: true, force: true })
  }

  const syl = s => `      { text: ${JSON.stringify(s.text)}, start: ${s.start}, end: ${s.end}, open: ${s.open} },`
  const line = l => [`    { start: ${l.start}, end: ${l.end}, syls: [`, ...l.syls.map(syl), '    ] },'].join('\n')
  fs.writeFileSync(moduleFile, [
    `// Written by tools/render.mjs from tools/songs/${name}.mjs: render again, do not edit.`,
    '// The timing is in seconds from the start of the audio, the same in every style.',
    `// built ${buildHash}`,
    ...Object.entries(sources).map(([asset, { wav, m4a }]) => `// source ${asset} ${wav} ${m4a}`),
    "import type { Sounds, Timing } from '../song'",
    '',
    'export const TIMING: Timing = {',
    ...['bpm', 'beat', 'pulse', 'bar', 'duration', 'outroAt', 'bloomAt', 'finaleAt', 'bassAt', 'drumsAt'].filter(key => key in timing).map(key => `  ${key}: ${timing[key]},`),
    ...(timing.sections ? ['  sections: [', ...timing.sections.map(s => `    { part: '${s.part}', start: ${s.start}, end: ${s.end} },`), '  ],'] : []),
    '  lines: [',
    ...timing.lines.map(line),
    '  ],',
    '}',
    '',
    '// The sound profiles this song is played in, and the voice styles of each with its audio.',
    'export const AUDIO: Sounds = {',
    ...PROFILES.filter(p => p in audio).flatMap(profile => [
      `  ${profile}: {`,
      ...pairs.filter(p => p.profile === profile).map(p => `    ${p.style}: '${p.asset}',`),
      '  },',
    ]),
    '}',
    '',
  ].join('\n'))
}

// Which pairs sound the same, to the bit: each group of files with one sound.
const bySound = {}
for (const [asset, { wav }] of Object.entries(sources)) (bySound[wav] ??= []).push(asset)
const identical = Object.values(bySound).filter(group => group.length > 1)

// The whole audio/ folder against every song: what is named and missing, and
// what is there and named by no song.
const declared = new Set(owners.keys())
const onDisk = fs.readdirSync(path.join(ROOT, 'audio')).filter(f => !f.startsWith('.')).map(f => `audio/${f}`)
const missing = [...declared].filter(asset => !onDisk.includes(asset)).sort()
const orphans = onDisk.filter(asset => !declared.has(asset)).sort()
console.log(JSON.stringify({ song: name, styles: report, identical, missing, orphans }, null, 1))
if (missing.length || orphans.length) {
  console.error(`audio/ does not match the songs: missing ${JSON.stringify(missing)}, named by no song ${JSON.stringify(orphans)}`)
  process.exitCode = 1
}
