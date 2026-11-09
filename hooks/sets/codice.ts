import type { Scenery } from '../draw'
import { box, grow, n1, random, sec } from '../draw'
import type { Song } from '../song'

// The scenery of work well done: a monitor where code is written line by line
// until a green check, a kanban board whose notes move to "done", and a cup of
// coffee for the singer. In the last line the monitor turns into a rocket that
// flies across the stage into the board, and a moon rises where it was.

const GREEN = '#3fb950'

const DEFS = `<defs>
<radialGradient id="codiceGlow"><stop offset="0" stop-color="#7ee787" stop-opacity="0.85"/><stop offset="1" stop-color="#7ee787" stop-opacity="0"/></radialGradient>
<linearGradient id="codiceScreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1117"/><stop offset="1" stop-color="#161b22"/></linearGradient>
<radialGradient id="codiceMoon"><stop offset="0" stop-color="#fff3c4" stop-opacity="0.75"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient>
<g id="codiceRocket">
<g><animateTransform attributeName="transform" type="scale" values="1 1;1.35 1.1;0.9 0.9;1.2 1" dur="0.16s" repeatCount="indefinite"/><path d="M -19 -5 L -36 0 L -19 5 Z" fill="#ffd166"/><path d="M -19 -3 L -28 0 L -19 3 Z" fill="#ff7b39"/></g>
<path d="M -13 -7 L -22 -15 L -17 -7 Z" fill="#ff6f91"/><path d="M -13 7 L -22 15 L -17 7 Z" fill="#ff6f91"/>
<path d="M -20 -7 L 10 -7 Q 24 -7 27 0 Q 24 7 10 7 L -20 7 Z" fill="#ece9f5" stroke="#b9b3cc" stroke-width="1"/>
<path d="M 15 -6.6 Q 24 -6 27 0 Q 24 6 15 6.6 Z" fill="#ff6f91"/>
<circle r="5" fill="#0d1117" stroke="#8b8fa3" stroke-width="1.5"/><path d="M -2.6 0 L -0.8 1.9 L 2.7 -2.1" stroke="#3fb950" stroke-width="1.5" fill="none" stroke-linecap="round"/>
</g>
</defs>`

// ---------- the rocket's timeline ----------

// The monitor turns into the rocket at the last line, which runs its engine for
// two beats and flies into the board as the closing words light up.
const launchAt = (song: Song) => song.lines[5]?.start ?? song.outroAt - 8 * song.beat
const takeOffAt = (song: Song) => launchAt(song) + 2 * song.beat
const boomAt = (song: Song) => song.outroAt

// ---------- the kanban board on the right-hand wall ----------

const NOTE_W = 16
const NOTE_H = 13
const NOTE_COLORS = ['#ffd166', '#ff6f91', '#7dd3fc', '#a7f3d0', '#c4b5fd']
// Where each note waits, and where it ends up once done.
const TODO = [[614, 31], [634, 31], [614, 49], [634, 49], [614, 67]] as const
const DONE = [[660, 31], [680, 31], [660, 49], [680, 49], [660, 67]] as const

// One note moves to "done" in each of the first five lines of the song.
function doneAt(song: Song) {
  return song.lines.slice(0, 5).map((line, i) => (i < 3 ? line.start + 2 : line.start))
}

function board(song: Song) {
  const label = (x: number, text: string) =>
    `<text x="${x}" y="27" text-anchor="middle" font-family="Menlo, 'SF Mono', monospace" font-weight="700" font-size="6" letter-spacing="0.5" fill="#c9b8ff">${text}</text>`
  const times = doneAt(song)
  const notes = TODO.map(([x, y], i) => {
    const [dx, dy] = [(DONE[i]?.[0] ?? x) - x, (DONE[i]?.[1] ?? y) - y]
    const t = times[i] ?? song.finaleAt
    const color = NOTE_COLORS[i % NOTE_COLORS.length] ?? '#ffd166'
    // A small hop on the way across, then it stays; a green tick once there.
    const move = `<animateTransform attributeName="transform" type="translate" values="0 0;${n1(dx / 2)} ${n1(dy / 2 - 8)};${dx} ${dy}" dur="0.6s" begin="${sec(t)}" fill="freeze"/>`
    const tick =
      `<path d="M ${x + 10} ${y + 9} l 2 2 l 4 -5" stroke="${GREEN}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity="0">` +
      `<set attributeName="opacity" to="1" begin="${sec(t + 0.6)}" fill="freeze"/></path>`
    return (
      `<g>${move}<rect x="${x}" y="${y}" width="${NOTE_W}" height="${NOTE_H}" fill="${color}"/>` +
      box(x + 3, y + 3, 9, 1.2, '#00000055') +
      box(x + 3, y + 6, 6, 1.2, '#00000055') +
      `${tick}</g>`
    )
  }).join('')
  const gone = `<animate attributeName="opacity" to="0" begin="${sec(boomAt(song) + 0.05)}" dur="0.15s" fill="freeze"/>`
  return (
    `<rect x="606" y="16" width="96" height="86" fill="#3a2a55"/>` +
    `<g>${gone}<rect x="610" y="20" width="88" height="78" fill="#1c1830"/>` +
    `${label(632, 'DA FARE')}${label(677, 'FATTO')}<rect x="654" y="20" width="2" height="78" fill="#3a2a55"/>${notes}</g>` +
    moon(song)
  )
}

// Where the board was, once the rocket has hit it: the night sky and the moon.
function moon(song: Song) {
  const at = boomAt(song) + 0.5
  const r = random(31)
  let stars = ''
  for (let i = 0; i < 12; i++) {
    stars += `<circle cx="${n1(613 + r() * 82)}" cy="${n1(23 + r() * 72)}" r="${n1(0.6 + r() * 0.6)}" fill="#fff"><animate attributeName="opacity" values="0.2;1;0.2" dur="${n1(1.8 + r() * 2.5)}s" begin="${n1(r() * 2)}s" repeatCount="indefinite"/></circle>`
  }
  const craters = [[-7, -5, 4], [6, 4, 3], [-3, 8, 2.2], [8, -8, 2]]
    .map(([x, y, cr]) => `<circle cx="${(x ?? 0) + 668}" cy="${(y ?? 0) + 52}" r="${cr}" fill="#e6d79a" opacity="0.8"/>`)
    .join('')
  const shooting =
    `<path d="M 0 0 L -14 5" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity="0">` +
    `<animateTransform attributeName="transform" type="translate" from="694 26" to="640 46" begin="${sec(at + 2.5)}" dur="0.7s"/>` +
    `<animate attributeName="opacity" values="0;1;0" dur="0.7s" begin="${sec(at + 2.5)}"/></path>`
  return (
    `<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${sec(at)}" dur="1.5s" fill="freeze"/>` +
    `<rect x="610" y="20" width="88" height="78" fill="url(#night)"/>${stars}` +
    `<circle cx="668" cy="52" r="38" fill="url(#codiceMoon)"><animate attributeName="r" values="34;40;34" dur="3s" repeatCount="indefinite"/></circle>` +
    `<circle cx="668" cy="52" r="20" fill="#fdf3c4"/>${craters}${shooting}</g>`
  )
}

// ---------- the monitor beside the singer ----------

// The code typed on the screen: each line its indent and colored words (color, width).
const CODE: readonly (readonly [number, readonly (readonly [string, number])[]])[] = [
  [0, [['#ff7b72', 26], ['#d2a8ff', 40], ['#c9d1d9', 18]]],
  [12, [['#ff7b72', 20], ['#79c0ff', 34], ['#c9d1d9', 30]]],
  [12, [['#d2a8ff', 46], ['#a5d6ff', 52]]],
  [24, [['#ff7b72', 16], ['#c9d1d9', 28], ['#7ee787', 40]]],
  [24, [['#79c0ff', 38], ['#a5d6ff', 44]]],
  [12, [['#ff7b72', 30], ['#7ee787', 24]]],
  [0, [['#c9d1d9', 8]]],
]
const SCREEN = { x: 220, y: 314, w: 160, h: 110 }
const CODE_X = SCREEN.x + 8
const CODE_Y = SCREEN.y + 10
const LINE_STEP = 12

function code(song: Song) {
  // Typed from the first second until just before the bloom, as the song builds.
  const step = (song.bloomAt - 2.5) / (CODE.length - 1)
  let out = ''
  CODE.forEach(([indent, words], i) => {
    const begin = 1 + i * step
    let x = CODE_X + indent
    words.forEach(([color, width], j) => {
      out +=
        `<rect x="${x}" y="${CODE_Y + i * LINE_STEP}" width="0" height="5" rx="1" fill="${color}">` +
        `<animate attributeName="width" from="0" to="${width}" begin="${sec(begin + j * 0.25)}" dur="0.3s" fill="freeze"/></rect>`
      x += width + 4
    })
  })
  // The cursor blinks where the last line ends, until the check.
  const last = CODE[CODE.length - 1]
  const cursorX = CODE_X + (last?.[0] ?? 0) + (last?.[1].reduce((sum, [, w]) => sum + w + 4, 0) ?? 0)
  out +=
    `<rect x="${cursorX}" y="${CODE_Y + (CODE.length - 1) * LINE_STEP - 1}" width="4" height="7" fill="#c9d1d9">` +
    `<animate attributeName="opacity" values="1;0" dur="0.8s" calcMode="discrete" repeatCount="indefinite" end="${sec(song.finaleAt)}"/>` +
    `<set attributeName="visibility" to="hidden" begin="${sec(song.finaleAt)}" fill="freeze"/></rect>`
  return out
}

// The progress bar fills from the bloom to the finale.
function progress(song: Song) {
  const x = SCREEN.x + 12
  const y = SCREEN.y + SCREEN.h - 14
  const w = SCREEN.w - 24
  return (
    `<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${sec(song.bloomAt)}" dur="0.4s" fill="freeze"/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="6" rx="3" fill="none" stroke="#30363d" stroke-width="1.5"/>` +
    `<rect x="${x}" y="${y}" width="0" height="6" rx="3" fill="${GREEN}">` +
    `<animate attributeName="width" from="0" to="${w}" begin="${sec(song.bloomAt + 0.3)}" dur="${sec(song.finaleAt - song.bloomAt - 0.6)}" fill="freeze"/></rect></g>`
  )
}

// At the finale the code dims, the screen flashes green and a check appears.
function check(song: Song) {
  const cx = SCREEN.x + SCREEN.w / 2
  const cy = SCREEN.y + SCREEN.h / 2
  return (
    `<rect x="${SCREEN.x}" y="${SCREEN.y}" width="${SCREEN.w}" height="${SCREEN.h}" fill="${GREEN}" opacity="0">` +
    `<animate attributeName="opacity" values="0;0.45;0.12" dur="0.8s" begin="${sec(song.finaleAt)}" fill="freeze"/></rect>` +
    `<g transform="translate(${cx} ${cy})"><g transform="scale(0)">${grow(song.finaleAt + 0.1, 0.6)}` +
    `<animateTransform attributeName="transform" type="scale" values="1;1.12;1" dur="${sec(2 * song.beat)}" begin="${sec(song.finaleAt + 0.8)}" end="${sec(song.outroAt)}" repeatCount="indefinite"/>` +
    `<path d="M -30 2 L -10 22 L 32 -24" stroke="${GREEN}" stroke-width="13" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></g>`
  )
}

// Confetti bursting out of the screen through the finale, gone before the launch.
function confetti(song: Song) {
  const r = random(23)
  const colors = ['#ffd166', '#ff6f91', '#7dd3fc', '#7ee787', '#c4b5fd']
  let out = ''
  for (let i = 0; i < 12; i++) {
    const begin = [0, 1, 2]
      .map(k => song.finaleAt + 0.2 + i * 0.3 + k * 3)
      .filter(t => t + 2.4 <= launchAt(song))
      .map(sec)
      .join(';')
    if (!begin) continue
    const dx = Math.round((r() - 0.5) * 320)
    const up = Math.round(90 + r() * 80)
    const spin = Math.round((r() - 0.5) * 720)
    const color = colors[i % colors.length] ?? '#ffd166'
    out +=
      `<g transform="translate(300 330)"><g opacity="0">` +
      `<animateTransform attributeName="transform" type="translate" values="0 0;${dx / 2} ${-up};${dx} ${-up / 2 + 60}" keyTimes="0;0.4;1" dur="2.4s" begin="${begin}"/>` +
      `<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.75;1" dur="2.4s" begin="${begin}"/>` +
      `<rect x="-5" y="-2.5" width="10" height="5" fill="${color}">` +
      `<animateTransform attributeName="transform" type="rotate" from="0" to="${spin}" dur="2.4s" begin="${begin}"/></rect></g></g>`
  }
  return out
}

function monitor(song: Song) {
  const glow =
    `<circle cx="300" cy="370" r="120" fill="url(#codiceGlow)" opacity="0">` +
    `<animate attributeName="opacity" from="0" to="0.5" begin="${sec(song.finaleAt)}" dur="1.5s" fill="freeze"/>` +
    `<animate attributeName="opacity" values="0.4;0.75;0.4" dur="${sec(2 * song.beat)}" begin="${sec(song.finaleAt + 1.5)}" end="${sec(launchAt(song))}" repeatCount="indefinite"/>` +
    `<animate attributeName="opacity" to="0" begin="${sec(launchAt(song))}" dur="0.3s" fill="freeze"/></circle>`
  const desk =
    `<ellipse cx="300" cy="545" rx="125" ry="7" fill="#000" opacity="0.3"/>` +
    `<rect x="196" y="476" width="12" height="69" fill="#5a3d30"/><rect x="392" y="476" width="12" height="69" fill="#5a3d30"/>` +
    `<rect x="180" y="466" width="240" height="12" rx="3" fill="#7a5442"/>`
  const stand = `<rect x="286" y="436" width="28" height="24" fill="#3b3b4a"/><rect x="252" y="458" width="96" height="9" rx="3" fill="#4a4a5c"/>`
  const body =
    `<rect x="${SCREEN.x - 16}" y="${SCREEN.y - 14}" width="${SCREEN.w + 32}" height="${SCREEN.h + 30}" rx="10" fill="#2b2b38"/>` +
    `<rect x="${SCREEN.x}" y="${SCREEN.y}" width="${SCREEN.w}" height="${SCREEN.h}" rx="3" fill="url(#codiceScreen)"/>` +
    `<circle cx="300" cy="${SCREEN.y + SCREEN.h + 8}" r="2.5" fill="${GREEN}"/>`
  // The code fades back for the check.
  const screen =
    `<g><animate attributeName="opacity" from="1" to="0.15" begin="${sec(song.finaleAt)}" dur="0.4s" fill="freeze"/>${code(song)}${progress(song)}</g>`
  // The monitor nods to the beat through the finale.
  const nod = `<animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="${sec(song.beat)}" begin="${sec(song.finaleAt)}" end="${sec(song.outroAt)}" repeatCount="indefinite"/>`
  // At the launch the monitor is gone in a flash, and the rocket stands in its place.
  const vanish = `<animate attributeName="opacity" to="0" begin="${sec(launchAt(song))}" dur="0.25s" fill="freeze"/>`
  const flash =
    `<circle cx="300" cy="370" r="0" fill="#fff6d8" opacity="0.9">` +
    `<animate attributeName="r" from="0" to="110" begin="${sec(launchAt(song))}" dur="0.5s" fill="freeze"/>` +
    `<animate attributeName="opacity" from="0.9" to="0" begin="${sec(launchAt(song))}" dur="0.5s" fill="freeze"/></circle>`
  return `${glow}${desk}<g>${nod}${vanish}${stand}${body}${screen}${check(song)}</g>${confetti(song)}${flash}`
}

// ---------- the rocket's flight, over the whole stage ----------

// Stage coordinates: the screen's centre, where the rocket appears, and the board's.
const FROM = { x: 430, y: 152.6 }
const TO = { x: 1014, y: 59 }
const SAMPLES = 96
// How far the flight bows up, how high its waves go, how many there are.
const ARC = 60
const WAVE = 18

// The flight as computed, not drawn by hand: a line from the screen to the
// board, bowed up over the band, with one wave every two beats it lasts; the
// first wave rises, so it clears the singer's arm as it leaves.
export function flight(song: Song) {
  const dur = boomAt(song) - takeOffAt(song)
  const waves = Math.max(1, Math.round(dur / (2 * song.beat)))
  const points: { x: number; y: number }[] = []
  for (let i = 0; i <= SAMPLES; i++) {
    const p = i / SAMPLES
    const x = FROM.x + (TO.x - FROM.x) * p
    const y = FROM.y + (TO.y - FROM.y) * p - ARC * Math.sin(Math.PI * p) - WAVE * Math.sin(2 * Math.PI * waves * p) * (1 - 0.4 * p)
    points.push({ x, y })
  }
  // Distance along the path at each point, for where the rocket is at a time.
  const along = [0]
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!
    const b = points[i]!
    along.push(along[i - 1]! + Math.hypot(b.x - a.x, b.y - a.y))
  }
  return { points, along, dur, start: takeOffAt(song), waves }
}

// It speeds up as it goes: the share of the path flown at a share of the time.
const ease = (t: number) => 0.3 * t + 0.7 * t * t

// Where the rocket is, `t` seconds into its flight.
function at(f: ReturnType<typeof flight>, t: number) {
  const total = f.along[f.along.length - 1] ?? 0
  const goal = ease(Math.min(1, Math.max(0, t / f.dur))) * total
  let i = 1
  while (i < f.along.length - 1 && (f.along[i] ?? 0) < goal) i++
  const a = f.points[i - 1]!
  const b = f.points[i]!
  const span = (f.along[i] ?? 0) - (f.along[i - 1] ?? 0)
  const k = span > 0 ? (goal - (f.along[i - 1] ?? 0)) / span : 0
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }
}

function rocket(song: Song) {
  const f = flight(song)
  const path = 'M ' + f.points.map(p => `${n1(p.x)} ${n1(p.y)}`).join(' L ')
  const steps = 12
  const keyTimes = Array.from({ length: steps + 1 }, (_, i) => (i / steps).toFixed(3)).join(';')
  const keyPoints = Array.from({ length: steps + 1 }, (_, i) => ease(i / steps).toFixed(3)).join(';')
  const first = f.points[1] ?? TO
  const tilt = n1((Math.atan2(first.y - FROM.y, first.x - FROM.x) * 180) / Math.PI)
  // Standing where the screen was, its engine running, until it takes off.
  const standing =
    `<g transform="translate(${FROM.x} ${FROM.y}) rotate(${tilt})" visibility="hidden">` +
    `<set attributeName="visibility" to="visible" begin="${sec(launchAt(song))}"/><set attributeName="visibility" to="hidden" begin="${sec(f.start)}"/>` +
    `<g transform="scale(0)">${grow(launchAt(song), 0.4)}<g>` +
    `<animateTransform attributeName="transform" type="translate" values="0 0;0.9 0.4;-0.9 -0.4;0 0" dur="0.09s" begin="${sec(launchAt(song) + 0.4)}" repeatCount="indefinite"/>` +
    `<use href="#codiceRocket"/></g></g></g>`
  const flying =
    `<g visibility="hidden"><set attributeName="visibility" to="visible" begin="${sec(f.start)}"/><set attributeName="visibility" to="hidden" begin="${sec(boomAt(song))}"/>` +
    `<animateMotion path="${path}" begin="${sec(f.start)}" dur="${sec(f.dur)}" rotate="auto" calcMode="linear" keyTimes="${keyTimes}" keyPoints="${keyPoints}" fill="freeze"/>` +
    `<use href="#codiceRocket"/></g>`
  // Puffs of smoke left behind where the rocket was, each fading where it is.
  let smoke = ''
  for (let t = 0.1; t < f.dur - 0.1; t += 0.14) {
    const p = at(f, t)
    const begin = sec(f.start + t)
    smoke +=
      `<circle cx="${n1(p.x)}" cy="${n1(p.y)}" r="0" fill="#d8d3e8" opacity="0">` +
      `<animate attributeName="r" from="2" to="7" begin="${begin}" dur="1.1s" fill="freeze"/>` +
      `<animate attributeName="opacity" values="0.55;0" begin="${begin}" dur="1.1s" fill="freeze"/></circle>`
  }
  return smoke + standing + flying
}

// The rocket hits the board: a flash, a ring, and pieces flying out.
function boom(song: Song) {
  const t = sec(boomAt(song))
  const r = random(41)
  const colors = ['#ffd166', '#ff6f91', '#7dd3fc', '#a7f3d0', '#c4b5fd', '#ff7b39']
  let pieces = ''
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * 2 * Math.PI + r() * 0.3
    const far = 28 + r() * 32
    pieces +=
      `<rect x="-3" y="-2" width="6" height="4" fill="${colors[i % colors.length] ?? '#ffd166'}" opacity="0">` +
      `<animateTransform attributeName="transform" type="translate" from="0 0" to="${n1(Math.cos(angle) * far)} ${n1(Math.sin(angle) * far + 14)}" begin="${t}" dur="1.1s" fill="freeze"/>` +
      `<animate attributeName="opacity" values="1;1;0" keyTimes="0;0.6;1" begin="${t}" dur="1.1s" fill="freeze"/></rect>`
  }
  return (
    `<g transform="translate(${TO.x} ${TO.y})">` +
    `<circle r="0" fill="#fff6d8" opacity="0"><animate attributeName="r" from="4" to="36" begin="${t}" dur="0.5s" fill="freeze"/>` +
    `<animate attributeName="opacity" values="1;0" begin="${t}" dur="0.5s" fill="freeze"/></circle>` +
    `<circle r="0" fill="none" stroke="#ffd166" stroke-width="3" opacity="0"><animate attributeName="r" from="6" to="52" begin="${t}" dur="0.7s" fill="freeze"/>` +
    `<animate attributeName="opacity" values="0.9;0" begin="${t}" dur="0.7s" fill="freeze"/></circle>` +
    `${pieces}</g>`
  )
}

// ---------- the coffee for the singer's hand ----------

const MUG = [
  '.........',
  '.........',
  '.........',
  '......W..',
  '.....W...',
  '......W..',
  '.....W.W.',
  '......W..',
  '.........',
  '....MMMMM',
  '..HHMMMMM',
  '..H.MOOOM',
  '..H.MMMMM',
  '..HHMMMMM',
  '....SMMMS',
]
const MUG_COLORS: Record<string, string> = { M: '#f4f1ea', H: '#e6e1d6', S: '#cfc8bd', O: '#cf7b5c', W: '#dcd8ee' }

export const CODICE: Scenery = {
  neon: ['TUTTO PRONTO', 'PER TE ♥'],
  defs: DEFS,
  wall: board,
  prop: monitor,
  gadget: { pixels: MUG, colors: MUG_COLORS },
  overlay: song => rocket(song) + boom(song),
}
