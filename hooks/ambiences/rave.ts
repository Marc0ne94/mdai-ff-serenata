import type { Ambience } from '../draw'
import { box, dropLights, HEIGHT, n1, random, sec, WIDTH } from '../draw'
import type { Song } from '../song'
import { partsOf } from '../song'

// The rave ambience, for the Carica album: a warehouse at night, a truss of
// lamps along the top, a strip of LEDs chasing the beat behind the band, lasers
// sweeping the room in the drops, haze over a floor of neon lines, a crowd at
// the edges with glow sticks up; green and magenta light; the Claudes in dark
// glasses, playing the band's own instruments.
// Nothing flashes across the stage: at a rave's 180 beats a minute a flash on
// every beat would be three a second, the limit for people sensitive to
// flashing light. The light sweeps, and only small things blink.

const GREEN = '#39ff88'
const MAGENTA = '#ff3fd8'
const CYAN = '#3fe0ff'
const COLORS = [GREEN, MAGENTA, CYAN]
const STEEL = '#34323f'

const DEFS = `<defs>
<linearGradient id="raveWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05040a"/><stop offset="1" stop-color="#140a22"/></linearGradient>
<linearGradient id="raveFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0d2c"/><stop offset="1" stop-color="#07040e"/></linearGradient>
<linearGradient id="raveBeamGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${GREEN}" stop-opacity="0.45"/><stop offset="1" stop-color="${GREEN}" stop-opacity="0"/></linearGradient>
<linearGradient id="raveBeamMagenta" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${MAGENTA}" stop-opacity="0.45"/><stop offset="1" stop-color="${MAGENTA}" stop-opacity="0"/></linearGradient>
<radialGradient id="raveHaze"><stop offset="0" stop-color="#c9b8ff" stop-opacity="0.13"/><stop offset="1" stop-color="#c9b8ff" stop-opacity="0"/></radialGradient>
</defs>`

// The beat the band plays, which everything here moves to.
const beatOf = (song: Song) => song.pulse ?? song.beat
// When the kick comes in: the crowd jumps and the lamps chase from then.
const kickAt = (song: Song) => song.drumsAt ?? 6 * song.bar

// Lasers from one point on the truss, a fan of rays sweeping to and fro
// through each drop.
function lasers(song: Song, x: number, color: string, side: 1 | -1) {
  const beat = beatOf(song)
  const { on, off, first } = dropLights(song)
  let rays = ''
  for (let i = 0; i < 5; i++) {
    const angle = ((18 + i * 14) * Math.PI) / 180
    rays += `<line x1="${x}" y1="12" x2="${n1(x + side * 1200 * Math.cos(angle))}" y2="${n1(12 + 1200 * Math.sin(angle))}" stroke="${color}" stroke-width="0.9"/>`
  }
  return (
    `<g opacity="0"><set attributeName="opacity" to="0.6" begin="${on}" fill="freeze"/>` +
    `<set attributeName="opacity" to="0" begin="${off}" fill="freeze"/>` +
    `<g><animateTransform attributeName="transform" type="rotate" values="${-side * 10} ${x} 12;${side * 14} ${x} 12;${-side * 10} ${x} 12" dur="${sec(8 * beat)}" begin="${sec(first)}" repeatCount="indefinite"/>${rays}</g>` +
    `<circle cx="${x}" cy="12" r="2.5" fill="${color}"/></g>`
  )
}

function room(song: Song, wall: (r: () => number) => string) {
  const r = random(13)
  const beat = beatOf(song)
  // The scenery's wall draws first, as in the club.
  const window = wall(r)
  let panels = ''
  for (let x = 36; x < WIDTH; x += 72) panels += box(x, 0, 1.2, 150, '#000', ' opacity="0.4"')
  // The truss, braced in a zigzag, and its lamps lighting one after the other.
  const from = 120
  const to = WIDTH - 130
  const zigzag: string[] = []
  for (let x = from, i = 0; x <= to; x += 10, i++) zigzag.push(`${x},${i % 2 ? 16 : 7}`)
  let lamps = ''
  for (let x = from + 20, i = 0; x < to; x += 80, i++) {
    lamps +=
      box(x - 4, 17, 8, 6, '#22202c') +
      `<rect x="${x - 3}" y="21" width="6" height="2.5" fill="${COLORS[i % 3]}" opacity="0.3"><animate attributeName="opacity" values="1;0.3;0.3;0.3" dur="${sec(4 * beat)}" begin="${sec(kickAt(song) + (i % 4) * beat)}" end="${sec(song.outroAt + 1)}" repeatCount="indefinite"/></rect>`
  }
  const truss =
    box(from, 6, to - from, 1.5, STEEL) + box(from, 16, to - from, 1.5, STEEL) +
    `<polyline points="${zigzag.join(' ')}" fill="none" stroke="${STEEL}" stroke-width="1"/>${lamps}`
  // A strip of LEDs low on the wall, a wave running along it on the beat.
  let leds = ''
  for (let x = 110, i = 0; x < WIDTH - 100; x += 18, i++) {
    leds += `<rect x="${x}" y="137" width="3" height="3" fill="${COLORS[i % 3]}" opacity="0.2"><animate attributeName="opacity" values="1;0.2;0.2;0.2" dur="${sec(4 * beat)}" begin="${sec(kickAt(song) + (i % 8) * (beat / 2))}" end="${sec(song.outroAt + 1)}" repeatCount="indefinite"/></rect>`
  }
  // Haze drifting slowly across the room.
  let haze = ''
  for (let i = 0; i < 3; i++) {
    const x = 180 + i * 340
    haze += `<ellipse cx="${x}" cy="${130 + i * 6}" rx="230" ry="34" fill="url(#raveHaze)"><animateTransform attributeName="transform" type="translate" values="0 0;${i % 2 ? -60 : 60} 0;0 0" dur="${n1(16 + r() * 8)}s" repeatCount="indefinite"/></ellipse>`
  }
  const pixelHeart = [
    [1, 0], [2, 0], [4, 0], [5, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
    [2, 4], [3, 4], [4, 4], [3, 5],
  ]
    .map(([x, y]) => box(52 + (x ?? 0) * 5, 34 + (y ?? 0) * 5, 5, 5, MAGENTA))
    .join('')
  // The floor: neon lines running away to the back of the stage.
  let grid = ''
  for (const y of [158, 170, 186, 206]) grid += `<line x1="0" y1="${y}" x2="${WIDTH}" y2="${y}" stroke="${MAGENTA}" stroke-width="0.8" opacity="0.22"/>`
  for (let i = -7; i <= 7; i++) grid += `<line x1="${540 + i * 36}" y1="150" x2="${540 + i * 150}" y2="${HEIGHT}" stroke="${MAGENTA}" stroke-width="0.8" opacity="0.18"/>`
  return (
    `<rect width="${WIDTH}" height="150" fill="url(#raveWall)"/>${panels}${leds}` +
    `\n<g transform="translate(${WIDTH - 720} 0)">${window}</g>\n` +
    truss +
    lasers(song, 150, GREEN, 1) +
    lasers(song, WIDTH - 150, MAGENTA, -1) +
    `<text x="16" y="12" font-family="Menlo, 'SF Mono', monospace" font-weight="700" font-size="11" letter-spacing="1.5" fill="#d9ffe9" filter="url(#neon)">M2V-MDO</text>` +
    `<rect x="44" y="26" width="51" height="46" fill="#0d0a16" stroke="#3a2f55" stroke-width="3"/>${pixelHeart}` +
    `<rect y="150" width="${WIDTH}" height="${HEIGHT - 150}" fill="url(#raveFloor)"/>${grid}<rect y="150" width="${WIDTH}" height="2" fill="${MAGENTA}" opacity="0.6"/>` +
    `<g pointer-events="none">${haze}</g>`
  )
}

// The crowd at both edges of the stage, arms up, glow sticks in hand, jumping
// on every beat from the first kick, twice as high in the last drop when there
// is more than one.
function crowd(song: Song) {
  const r = random(17)
  const beat = beatOf(song)
  const drops = partsOf(song, 'drop')
  const last = drops.length > 1 ? drops.at(-1) : undefined
  const body = '#241a38'
  let people = ''
  ;[18, 54, 92, 130, 168, 940, 976, 1012, 1048].forEach((x, i) => {
    const up = 4 + r() * 3
    const tall = Math.round(r() * 6)
    const stick = COLORS[i % 3] ?? GREEN
    people +=
      `<g><animateTransform attributeName="transform" type="translate" values="0 0;0 ${n1(-up)};0 0" dur="${sec(beat)}" begin="${sec(kickAt(song) + (i % 2) * 0.04)}" end="${sec(song.outroAt + 1)}" repeatCount="indefinite"/>` +
      (last
        ? `<animateTransform attributeName="transform" type="translate" values="0 0;0 ${n1(-2 * up)};0 0" dur="${sec(beat)}" begin="${sec(last.start + (i % 2) * 0.04)}" end="${sec(last.end)}" repeatCount="indefinite"/>`
        : '') +
      `<ellipse cx="${x}" cy="${238 - tall}" rx="17" ry="14" fill="${body}"/><circle cx="${x}" cy="${214 - tall}" r="9" fill="${body}"/>` +
      `<path d="M ${x - 10} ${226 - tall} L ${x - 15} ${196 - tall}" stroke="${body}" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M ${x + 10} ${226 - tall} L ${x + 14} ${194 - tall}" stroke="${body}" stroke-width="5" stroke-linecap="round"/>` +
      `<line x1="${x + 14}" y1="${194 - tall}" x2="${x + 18}" y2="${183 - tall}" stroke="${stick}" stroke-width="2.4" stroke-linecap="round" filter="url(#neon)"/></g>`
  })
  return people
}

// Dark glasses over the eyes, in a Claude's own cells, a glint on each lens.
const SHADES =
  box(0.3, 0.7, 3, 1.5, '#0b0a12') + box(4.7, 0.7, 3, 1.5, '#0b0a12') + box(3.3, 0.9, 1.4, 0.35, '#0b0a12') +
  box(-0.2, 0.9, 0.5, 0.35, '#0b0a12') + box(7.7, 0.9, 0.5, 0.35, '#0b0a12') +
  box(0.6, 0.9, 0.9, 0.35, '#9ffcff') + box(5, 0.9, 0.9, 0.35, '#9ffcff')

export const RAVE: Ambience = {
  defs: DEFS,
  room,
  beams: ['raveBeamGreen', 'raveBeamMagenta'],
  sign: { fill: '#ffe6fb', stroke: MAGENTA },
  crown: SHADES,
  instruments: 'band',
  // A black riser with a neon edge.
  riser: { fill: '#14121c', edge: GREEN },
  front: crowd,
}
