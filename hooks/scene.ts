import { AMBIENCES } from './ambiences'
import { box, FONT, GOLD, HEIGHT, n1, NEON, ORANGE, random, sec, shift, SKIN, toggle, WIDTH } from './draw'
import type { Ambience, Scenery } from './draw'
import { SCENERIES } from './sets'
import type { Song } from './song'
import { ambienceOf } from './song'

// The stage the band draws while the song plays: a band of pixel Claudes at
// the back (bass, drums on a riser, keys), the singer and the rose in front.
// Its timeline is the song's: every animation
// counts from the moment the drawing appears, as the audio does.
const CX = WIDTH / 2

// Where everyone stands, across the stage.
const BASS_X = 280
const ROSE_X = 430
const SINGER_X = CX
const DRUMS_X = 700
const AMP_X = 760
const KEYS_X = 870

// The stage's size, which the band draws it at.
export const STAGE = { width: WIDTH, height: HEIGHT }

// The song the stage is drawn for, its scenery, and when each part plays in
// it, as tools/synth.mjs arranges a song. band() sets them for its one
// synchronous pass and clears them after: a piece drawn outside band() fails
// at once, instead of drawing whatever song was drawn last.
type Tuned = { SONG: Song; SCENERY: Scenery; AMBIENCE: Ambience; BASS_AT: number; DRUMS_AT: number; CRASHES: number[]; BAND_END: number }
let TUNED: Tuned | null = null

function tuned(): Tuned {
  if (!TUNED) throw new Error('the stage is drawn by band() only')
  return TUNED
}


const DEFS = `<defs>
<clipPath id="stage"><rect width="${WIDTH}" height="${HEIGHT}" rx="16"/></clipPath>
<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#120b22"/><stop offset="1" stop-color="#241539"/></linearGradient>
<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d1b44"/><stop offset="1" stop-color="#170e25"/></linearGradient>
<linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1030"/><stop offset="1" stop-color="#2a1d52"/></linearGradient>
<linearGradient id="beamPurple" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a78bfa" stop-opacity="0.55"/><stop offset="1" stop-color="#a78bfa" stop-opacity="0"/></linearGradient>
<linearGradient id="beamPink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f472b6" stop-opacity="0.55"/><stop offset="1" stop-color="#f472b6" stop-opacity="0"/></linearGradient>
<linearGradient id="beamWhite" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6d8" stop-opacity="0.45"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0.05"/></linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="#ffc2d4" stop-opacity="0.9"/><stop offset="1" stop-color="#ffc2d4" stop-opacity="0"/></radialGradient>
<radialGradient id="petal" cx="0.5" cy="1" r="1"><stop offset="0" stop-color="#7a0b2e"/><stop offset="0.45" stop-color="#d81b4f"/><stop offset="1" stop-color="#ff6f91"/></radialGradient>
<radialGradient id="petal2" cx="0.5" cy="1" r="1"><stop offset="0" stop-color="#5c0723"/><stop offset="0.5" stop-color="#b3123f"/><stop offset="1" stop-color="#ff4d78"/></radialGradient>
<linearGradient id="pot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9c4a32"/><stop offset="0.5" stop-color="#c6643f"/><stop offset="1" stop-color="#8a3f2a"/></linearGradient>
<filter id="neon" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<path id="heart" d="M0 3 C -6 -3 -12 2 -6 8 L 0 13 L 6 8 C 12 2 6 -3 0 3 Z"/>
<path id="sparkle" d="M0 -6 L1.5 -1.5 L6 0 L1.5 1.5 L0 6 L-1.5 1.5 L-6 0 L-1.5 -1.5 Z"/>
</defs>`

// ---------- the room ----------

function room() {
  const { SONG, SCENERY, AMBIENCE } = tuned()
  if (AMBIENCE.room) return AMBIENCE.room(SONG, r => SCENERY.wall(SONG, r))
  const r = random(7)
  // The scenery's wall draws first: the garland takes the random numbers after it.
  const wall = SCENERY.wall(SONG, r)
  const pixelHeart = [
    [1, 0], [2, 0], [4, 0], [5, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
    [2, 4], [3, 4], [4, 4], [3, 5],
  ]
    .map(([x, y]) => box(52 + (x ?? 0) * 5, 34 + (y ?? 0) * 5, 5, 5, '#d81b4f'))
    .join('')
  let panels = ''
  for (let x = 0; x < WIDTH; x += 48) panels += box(x, 0, 1, 150, '#000', ' opacity="0.18"')
  // A string of lights along the top of the wall.
  let garland = ''
  const wire: string[] = []
  const bulbs = ['#ffd166', '#ff6f91', '#a78bfa', '#7dd3fc']
  for (let x = 120, i = 0; x <= WIDTH - 130; x += 30, i++) {
    const u = ((x - 120) % 180) / 180
    const y = 6 + 10 * (1 - (2 * u - 1) ** 2)
    wire.push(`${x},${n1(y)}`)
    garland += `<circle cx="${x}" cy="${n1(y + 3)}" r="2.6" fill="${bulbs[i % bulbs.length]}"><animate attributeName="opacity" values="0.35;1;0.35" dur="${n1(1.5 + r() * 1.5)}s" begin="${n1(r() * 2)}s" repeatCount="indefinite"/></circle>`
  }
  return `<rect width="${WIDTH}" height="150" fill="url(#wall)"/>${panels}
<g transform="translate(${WIDTH - 720} 0)">${wall}</g>
<polyline points="${wire.join(' ')}" fill="none" stroke="#3a2a55" stroke-width="1.2"/>${garland}
<text x="16" y="17" font-family="Menlo, 'SF Mono', monospace" font-weight="700" font-size="11" letter-spacing="1.5" fill="#ffd6f3" filter="url(#neon)">M2V-MDO</text>
<rect x="44" y="26" width="51" height="46" fill="#2b1c40" stroke="#4a3566" stroke-width="3"/>${pixelHeart}
<rect y="150" width="${WIDTH}" height="${HEIGHT - 150}" fill="url(#floor)"/><rect y="150" width="${WIDTH}" height="2" fill="#4c3270"/>`
}

function neon() {
  const { SONG, SCENERY, AMBIENCE } = tuned()
  const { fill, stroke } = AMBIENCE.sign ?? { fill: '#ffe3f6', stroke: '#ff4fc3' }
  const sign = (text: string, extra: string) =>
    `<text x="${CX}" y="46" text-anchor="middle" font-family="${NEON}" font-weight="700" font-size="22" letter-spacing="4" fill="${fill}" stroke="${stroke}" stroke-width="0.8" filter="url(#neon)" opacity="0">${text}${extra}</text>`
  return (
    sign(
      SCENERY.neon[0],
      `<animate attributeName="opacity" values="0;1;0.2;1;0.4;1" keyTimes="0;0.2;0.35;0.5;0.7;1" dur="1.2s" begin="0.2s" fill="freeze"/>` +
        `<animate attributeName="opacity" from="1" to="0" begin="${sec(SONG.outroAt + 0.4)}" dur="0.6s" fill="freeze"/>`,
    ) +
    sign(
      SCENERY.neon[1],
      `<animate attributeName="opacity" values="0;1;0.3;1" keyTimes="0;0.4;0.6;1" dur="1s" begin="${sec(SONG.outroAt + 1)}" fill="freeze"/>`,
    )
  )
}

function lights() {
  const { SONG, AMBIENCE, BASS_AT, DRUMS_AT } = tuned()
  const { beat, finaleAt, outroAt } = SONG
  const [left, right] = AMBIENCE.beams ?? ['beamPurple', 'beamPink']
  const beam = (x: number, fill: string, values: string, begin: number) =>
    `<polygon points="${x - 12},0 ${x + 12},0 ${x + 62},218 ${x - 62},218" fill="url(#${fill})" opacity="0">` +
    `<animate attributeName="opacity" from="0" to="0.35" begin="${sec(begin)}" dur="1.5s" fill="freeze"/>` +
    toggle('opacity', values, 2 * beat, finaleAt, outroAt) +
    `</polygon>`
  const spot =
    `<polygon points="${SINGER_X - 14},0 ${SINGER_X + 14},0 ${SINGER_X + 78},218 ${SINGER_X - 78},218" fill="url(#beamWhite)" opacity="0">` +
    `<animate attributeName="opacity" from="0" to="0.8" begin="${sec(BASS_AT - 0.8)}" dur="1.5s" fill="freeze"/></polygon>`
  return beam(BASS_X, left, '0.6;0.2', BASS_AT) + beam(KEYS_X, right, '0.2;0.6', DRUMS_AT) + spot
}

// ---------- the pixel Claudes ----------

type Member = {
  cx: number
  feet: number
  u: number
  blink: number
  arms?: string
  front?: string
  face?: string
  hop?: { dur: number; begin: number; end: number }
}

// One Claude in cells of `u` pixels: an 8×6 body, four legs below it, and
// arms on rows 2–3 unless the member brings its own; `front` is drawn over
// it in the same cells (an instrument, a hand).
function member({ cx, feet, u, blink, arms, front, face, hop }: Member) {
  const { AMBIENCE } = tuned()
  const eye = (x: number) =>
    `<rect x="${x}" y="1" width="1" height="1" fill="#000"><animate attributeName="height" values="1;1;0.25;1" keyTimes="0;0.93;0.96;1" dur="4.3s" begin="${sec(blink)}" repeatCount="indefinite"/><animate attributeName="y" values="1;1;1.375;1" keyTimes="0;0.93;0.96;1" dur="4.3s" begin="${sec(blink)}" repeatCount="indefinite"/></rect>`
  const legs = [0, 2, 5, 7].map(x => box(x, 6, 1, 2, ORANGE)).join('')
  const motion = hop ? shift('0 0;0 -0.5', hop.dur, hop.begin, hop.end) : ''
  return `<ellipse cx="${cx}" cy="${feet}" rx="${6 * u}" ry="${u * 0.5}" fill="#000" opacity="0.3"/>
<g transform="translate(${cx - 4 * u} ${feet - 8 * u}) scale(${u})" shape-rendering="crispEdges"><g>${motion}
${box(0, 0, 8, 6, ORANGE)}${arms ?? box(-2, 2, 2, 2, ORANGE) + box(8, 2, 2, 2, ORANGE)}${legs}${eye(1)}${eye(6)}${face ?? ''}${front ?? ''}${AMBIENCE.crown ?? ''}
</g></g>`
}

// How far the singer's mouth opens over the whole clip, 0 to 1.
function mouthTrack() {
  const { SONG } = tuned()
  const points: [number, number][] = [[0, 0]]
  for (const line of SONG.lines) {
    for (const syl of line.syls) {
      points.push(
        [syl.start, 0],
        [syl.start + 0.07, 0.3 + 0.7 * syl.open],
        [Math.max(syl.start + 0.08, syl.end - 0.12), 0.2 + 0.5 * syl.open],
        [syl.end - 0.03, 0],
      )
    }
  }
  points.push([SONG.duration, 0])
  let last = -1
  return points.map(([t, open]) => {
    const time = Math.max(t, last + 0.01)
    last = time
    return [time, open] as const
  })
}

const TAPS = 5
const TAP_WINDOW = 2.5

function singer() {
  const { SONG, SCENERY, BASS_AT } = tuned()
  const u = 10
  const feet = 214
  const top = feet - 8 * u
  const { beat, outroAt } = SONG
  const track = mouthTrack()
  const keyTimes = track.map(([t], i) => (i === track.length - 1 ? '1' : (t / SONG.duration).toFixed(5))).join(';')
  const mouth =
    `<rect x="3" y="3" width="2" height="0" fill="#1a0f14">` +
    `<animate attributeName="height" values="${track.map(([, open]) => (open * 1.3).toFixed(2)).join(';')}" keyTimes="${keyTimes}" dur="${sec(SONG.duration)}" calcMode="discrete" fill="freeze"/></rect>` +
    `<g opacity="0"><set attributeName="opacity" to="1" begin="${sec(outroAt + 2)}" fill="freeze"/>` +
    `${box(2.5, 3, 0.5, 0.5, '#1a0f14')}${box(3, 3.5, 2, 0.5, '#1a0f14')}${box(5, 3, 0.5, 0.5, '#1a0f14')}</g>`
  const arm = (x: number, isFirst: boolean) =>
    `<rect x="${x}" y="2" width="2" height="2" fill="${ORANGE}">${toggle('y', isFirst ? '2;1' : '1;2', 2 * beat, BASS_AT, outroAt + 1)}</rect>`
  // Drawn in the singer's cells, its stem in the right-hand arm, moving with it.
  const p = 0.4
  const pixels = SCENERY.gadget.pixels.flatMap((row, y) =>
    [...row].map((c, x) => {
      const fill = SCENERY.gadget.colors[c]
      return fill ? box(7.2 + x * p, -3.6 + y * p, p, p, fill) : ''
    }),
  ).join('')
  const flower =
    `<g>${shift('0 -1;0 0', 2 * beat, BASS_AT, outroAt + 1)}<g transform="translate(9 2.4)"><g transform="scale(0)">` +
    `<animateTransform attributeName="transform" type="scale" values="0;1.2;1" dur="0.5s" begin="tap${TAPS}.click" fill="freeze"/>` +
    `<animateTransform attributeName="transform" type="scale" values="1;1.15;0" dur="0.4s" begin="hold.dblclick" fill="freeze"/>` +
    `<g transform="translate(-9 -2.4)">${pixels}</g></g></g></g>`
  const micX = SINGER_X - 2.6 * u
  const stand =
    `<line x1="${micX}" y1="${top + 3.8 * u}" x2="${micX - 4}" y2="${feet}" stroke="#4a4a57" stroke-width="3"/>` +
    `<ellipse cx="${micX - 4}" cy="${feet}" rx="9" ry="2.5" fill="#2b2b33"/>` +
    `<rect x="${micX - 3}" y="${top + 2.7 * u}" width="7" height="12" rx="3" fill="#2b2b33"/><rect x="${micX - 2}" y="${top + 2.7 * u + 1}" width="5" height="5" rx="2" fill="#8d8d9a"/>`
  let notes = ''
  const starts = SONG.lines.flatMap(line => [line.start, line.start + (line.end - line.start) / 2])
  ;['♪', '♫', '♪'].forEach((glyph, i) => {
    const begin = starts.map(t => sec(t + i * 0.8)).join(';')
    const drift = i === 1 ? -26 : 26 + i * 10
    // From just above the head, so the face stays clear.
    const x = SINGER_X - 4
    notes += `<text font-family="${FONT}" font-size="${16 - i * 2}" fill="${GOLD}" opacity="0">${glyph}<animateTransform attributeName="transform" type="translate" values="${x} ${top - 4};${x + drift / 2} ${top - 28};${x + drift} ${top - 52}" dur="2.4s" begin="${begin}"/><animate attributeName="opacity" values="0;1;0" dur="2.4s" begin="${begin}"/></text>`
  })
  return (
    member({
      cx: SINGER_X,
      feet,
      u,
      blink: 0,
      arms: arm(-2, true) + arm(8, false),
      face: mouth + flower,
      hop: { dur: beat, begin: BASS_AT, end: outroAt + 1 },
    }) +
    stand +
    notes
  )
}

// Taps on the singer, counted without script: each one shows the next target,
// and they all start over a moment after the first.
function taps() {
  const u = 10
  const top = 214 - 8 * u
  const area = `x="${SINGER_X - 6 * u}" y="${top - 6 * u}" width="${12 * u}" height="${14 * u}" fill="#000" opacity="0"`
  let out = ''
  for (let i = 0; i < 3; i++) {
    const begin = `tap${TAPS}.click+${(0.3 + i * 0.35).toFixed(2)}s`
    out += `<g transform="translate(${SINGER_X + 5 * u + (i - 1) * 10} 100)"><g opacity="0"><animateTransform attributeName="transform" type="translate" values="0 0;${(i - 1) * 12} -45" dur="2.2s" begin="${begin}"/><animate attributeName="opacity" values="0;1;0" dur="2.2s" begin="${begin}"/><use href="#heart" transform="scale(0.8)" fill="#ff6f91"/></g></g>`
  }
  for (let i = 1; i <= TAPS; i++) {
    const isFirst = i === 1
    out +=
      `<rect id="tap${i}" ${area} visibility="${isFirst ? 'visible' : 'hidden'}">` +
      (isFirst ? '' : `<set attributeName="visibility" to="visible" begin="tap${i - 1}.click"/>`) +
      `<set attributeName="visibility" to="hidden" begin="tap${i}.click"/>` +
      `<set attributeName="visibility" to="${isFirst ? 'visible' : 'hidden'}" begin="tap1.click+${TAP_WINDOW}s"/></rect>`
  }
  // While the flower is out, a double tap puts it away and a heart flies off.
  out +=
    `<g transform="translate(${SINGER_X + 5 * u} 96)"><g opacity="0"><animateTransform attributeName="transform" type="translate" values="0 0;6 -30;0 -64" dur="1.8s" begin="hold.dblclick+0.2s"/>` +
    `<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.6;1" dur="1.8s" begin="hold.dblclick+0.2s"/><use href="#heart" transform="scale(1.5)" fill="#ff4d78"/></g></g>` +
    `<rect id="hold" ${area} visibility="hidden"><set attributeName="visibility" to="visible" begin="tap${TAPS}.click"/>` +
    `<set attributeName="visibility" to="hidden" begin="hold.dblclick"/></rect>`
  return out
}

function bassist() {
  const { SONG, AMBIENCE, BASS_AT, BAND_END } = tuned()
  if (AMBIENCE.instruments === 'antica') return kitharist()
  const { beat } = SONG
  const bass =
    `<polygon points="0.2,4.2 2.8,3.6 4.6,4.6 4.2,6.4 1.8,7 0,6" fill="#7c4dbd"/>` +
    `<polygon points="0.8,4.6 2.6,4.1 3.9,4.9 3.6,5.9 1.9,6.3 0.7,5.6" fill="#9b6fd6"/>` +
    box(1.4, 4.7, 1.3, 0.35, '#1d1424') +
    box(1.9, 5.5, 1.3, 0.35, '#1d1424') +
    box(0.9, 6.1, 0.4, 0.4, '#d9d0e6') +
    box(1.5, 6.4, 0.4, 0.4, '#d9d0e6') +
    `<line x1="4" y1="4.9" x2="11.2" y2="1.2" stroke="#2b1d22" stroke-width="0.7"/>` +
    `<line x1="4" y1="4.8" x2="11.2" y2="1.1" stroke="#e7def2" stroke-width="0.07"/>` +
    `<polygon points="11,0.7 12.6,-0.2 13,0.6 11.6,1.6" fill="#7c4dbd"/>` +
    box(11.7, -0.5, 0.4, 0.4, '#d9d0e6') +
    box(12.4, -0.8, 0.4, 0.4, '#d9d0e6')
  const hands =
    `<g>${shift('0 0;0 0.4', beat / 2, BASS_AT, BAND_END)}${box(-1.5, 3.6, 2, 1.5, ORANGE)}</g>` + box(8, 2, 2, 2, ORANGE)
  return member({
    cx: BASS_X,
    feet: 168,
    u: 7,
    blink: 1.3,
    arms: '',
    front: bass + hands,
    hop: { dur: beat, begin: BASS_AT, end: BAND_END },
  })
}

function drummer() {
  const { SONG, AMBIENCE, DRUMS_AT, CRASHES } = tuned()
  if (AMBIENCE.instruments === 'antica') return tympanist()
  const { beat, outroAt } = SONG
  const stickArm = (x: number, stick: string, values: string) =>
    `<g>${shift(values, beat, DRUMS_AT, outroAt)}${box(x, 2, 2, 2, ORANGE)}<line ${stick} stroke="#efd9a7" stroke-width="0.35"/></g>`
  const arms =
    stickArm(-2, 'x1="-1.5" y1="2.2" x2="-3.6" y2="0.4"', '0 -0.8;0 0.6') +
    stickArm(8, 'x1="9.5" y1="2.2" x2="11.6" y2="0.4"', '0 0.6;0 -0.8')
  const x = DRUMS_X
  const { fill, edge } = tuned().AMBIENCE.riser ?? { fill: '#2e1f45', edge: '#5b3d86' }
  const riser = `<rect x="${x - 72}" y="128" width="144" height="22" fill="${fill}"/><rect x="${x - 72}" y="128" width="144" height="2" fill="${edge}"/>`
  const crash = (cx: number, cy: number, rx: number) =>
    `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="128" stroke="#8c8c99" stroke-width="1.5"/>` +
    `<g transform="translate(${cx} ${cy})"><ellipse rx="${rx}" ry="${rx / 5}" fill="#f0c75e"><animateTransform attributeName="transform" type="rotate" values="0;-14;8;0" dur="0.7s" begin="${CRASHES.map(sec).join(';')}"/></ellipse></g>`
  const kit =
    crash(x - 42, 92, 10) +
    crash(x + 44, 86, 12) +
    `<ellipse cx="${x - 22}" cy="104" rx="8" ry="4.5" fill="#c2185b" stroke="#7a0b2e"/><ellipse cx="${x + 22}" cy="104" rx="8" ry="4.5" fill="#c2185b" stroke="#7a0b2e"/>` +
    `<g transform="translate(${x} 116)"><g><animateTransform attributeName="transform" type="scale" values="1.1;1;1;1.1;1;1" keyTimes="0;0.15;0.5;0.5;0.65;1" dur="${sec(2 * beat)}" begin="${sec(DRUMS_AT)}" end="${sec(outroAt)}" repeatCount="indefinite"/>` +
    `<circle r="15" fill="#f1e6f7" stroke="#c2185b" stroke-width="3"/><use href="#heart" transform="translate(0 -6) scale(0.75)" fill="#ff6f91"/></g></g>`
  return riser + member({ cx: x, feet: 128, u: 7, blink: 2.1, arms }) + kit
}

function keyboardist() {
  const { SONG, AMBIENCE, BAND_END } = tuned()
  if (AMBIENCE.instruments === 'antica') return auletes()
  const { beat } = SONG
  const x = KEYS_X
  // Fourteen white keys; a black one after each but the third and seventh of an octave.
  let keys = ''
  for (let i = 0; i < 13; i++) if (i % 7 !== 2 && i % 7 !== 6) keys += box(x - 37 + (i + 1) * 5.3 - 1.2, 144, 2.4, 2.8, '#1b1b22')
  const hand = (hx: number, values: string) =>
    `<g>${shift(values, beat / 2, 0.2, BAND_END)}${box(hx, 137, 9, 6, ORANGE)}</g>`
  const board =
    `<line x1="${x - 28}" y1="168" x2="${x + 28}" y2="151" stroke="#55556a" stroke-width="2"/><line x1="${x + 28}" y1="168" x2="${x - 28}" y2="151" stroke="#55556a" stroke-width="2"/>` +
    box(x - 40, 142, 80, 10, '#1b1b22') +
    box(x - 37, 144, 74, 5, '#f4f1ea') +
    keys +
    hand(x - 22, '0 0;0 2') +
    hand(x + 13, '0 2;0 0')
  return member({ cx: x, feet: 168, u: 7, blink: 3.2, arms: '' }) + board
}

function amp() {
  const { SONG, AMBIENCE, DRUMS_AT } = tuned()
  if (AMBIENCE.instruments === 'antica') return amphora()
  const { beat, outroAt } = SONG
  return (
    `<rect x="${AMP_X}" y="176" width="46" height="38" rx="3" fill="#1e1a26" stroke="#3a3348"/>` +
    `<rect x="${AMP_X + 4}" y="179" width="38" height="4" fill="#3a3348"/>` +
    `<g transform="translate(${AMP_X + 23} 199)"><g><animateTransform attributeName="transform" type="scale" values="1.15;1;1;1.15;1;1" keyTimes="0;0.15;0.5;0.5;0.65;1" dur="${sec(2 * beat)}" begin="${sec(DRUMS_AT)}" end="${sec(outroAt)}" repeatCount="indefinite"/>` +
    `<circle r="11" fill="#2d2838" stroke="#4a4258" stroke-width="2"/><circle r="4" fill="#4a4258"/></g></g>`
  )
}

// ---------- the ancient band ----------

const WOOD = '#a8743a'
const DARK_WOOD = '#7a4f24'
const BRONZE = '#c9a24a'
const STRING = '#efe6d2'

// The kithara, the lyre with a box: held on the left, strummed as the bass is.
function kitharist() {
  const { SONG, BASS_AT, BAND_END } = tuned()
  const { beat } = SONG
  const strings = [-3.6, -2.6, -1.6, -0.6].map(x => box(x, -0.3, 0.12, 4.5, STRING)).join('')
  const kithara =
    box(-4.8, -0.5, 0.5, 4.6, BRONZE) + box(0.3, -0.5, 0.5, 4.6, BRONZE) + box(-5.1, -0.9, 6.2, 0.5, BRONZE) +
    strings + box(-4.8, 4, 5.6, 2.6, WOOD) + box(-4.3, 4.4, 4.6, 1.6, DARK_WOOD)
  const hands =
    `<g>${shift('0 0;0 0.4', beat / 2, BASS_AT, BAND_END)}${box(-1.5, 3.6, 2, 1.5, ORANGE)}</g>` + box(8, 2, 2, 2, ORANGE)
  return member({ cx: BASS_X, feet: 168, u: 7, blink: 1.3, arms: '', front: kithara + hands, hop: { dur: beat, begin: BASS_AT, end: BAND_END } })
}

// The tympanon, the frame drum, beaten by hand on a stone platform, with two
// small jingling drums where the cymbals were.
function tympanist() {
  const { SONG, DRUMS_AT, CRASHES } = tuned()
  const { beat, outroAt } = SONG
  const handArm = (x: number, values: string) => `<g>${shift(values, beat, DRUMS_AT, outroAt)}${box(x, 2, 2, 2, ORANGE)}</g>`
  const arms = handArm(-2, '0 -0.8;0 0.6') + handArm(8, '0 0.6;0 -0.8')
  const x = DRUMS_X
  const platform = `<rect x="${x - 72}" y="128" width="144" height="22" fill="#3a3040"/><rect x="${x - 72}" y="128" width="144" height="2" fill="#6b5a70"/>`
  const jingles = (cx: number, cy: number, r: number) =>
    `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="128" stroke="#6b5a70" stroke-width="1.5"/>` +
    `<g transform="translate(${cx} ${cy})"><g><animateTransform attributeName="transform" type="rotate" values="0;-14;8;0" dur="0.7s" begin="${CRASHES.map(sec).join(';')}"/>` +
    `<circle r="${r}" fill="#efe0c0" stroke="${WOOD}" stroke-width="2"/>` +
    [0, 1, 2, 3].map(i => `<circle cx="${n1(Math.cos(i * 1.57 + 0.78) * r)}" cy="${n1(Math.sin(i * 1.57 + 0.78) * r)}" r="1.8" fill="${BRONZE}"/>`).join('') +
    `</g></g>`
  const drum =
    jingles(x - 42, 92, 8) +
    jingles(x + 44, 86, 9) +
    `<g transform="translate(${x} 116)"><g><animateTransform attributeName="transform" type="scale" values="1.1;1;1;1.1;1;1" keyTimes="0;0.15;0.5;0.5;0.65;1" dur="${sec(2 * beat)}" begin="${sec(DRUMS_AT)}" end="${sec(outroAt)}" repeatCount="indefinite"/>` +
    `<circle r="16" fill="#efe0c0" stroke="${WOOD}" stroke-width="3.5"/><circle r="10" fill="none" stroke="#c98a5a" stroke-width="1"/>` +
    `<use href="#heart" transform="translate(0 -6) scale(0.75)" fill="#d8693a"/></g></g>`
  return platform + member({ cx: x, feet: 128, u: 7, blink: 2.1, arms }) + drum
}

// The aulos, the double pipe: one reed in the mouth, two pipes spreading down,
// fingers moving on each.
function auletes() {
  const { SONG, BAND_END } = tuned()
  const { beat } = SONG
  const pipes =
    `<line x1="3.6" y1="3.8" x2="-1.4" y2="9.2" stroke="${BRONZE}" stroke-width="0.5"/>` +
    `<line x1="4.4" y1="3.8" x2="9.4" y2="9.2" stroke="${BRONZE}" stroke-width="0.5"/>` +
    box(3.4, 3.2, 1.2, 0.8, DARK_WOOD)
  const hand = (hx: number, hy: number, values: string) => `<g>${shift(values, beat / 2, 0.2, BAND_END)}${box(hx, hy, 1.6, 1.2, ORANGE)}</g>`
  return member({ cx: KEYS_X, feet: 168, u: 7, blink: 3.2, arms: '', front: pipes + hand(0.6, 6, '0 0;0.3 0') + hand(5.8, 6, '0.3 0;0 0') })
}

// An amphora where the amplifier stood, painted with a band and a meander.
function amphora() {
  const x = AMP_X + 23
  return (
    `<ellipse cx="${x}" cy="214" rx="18" ry="3" fill="#000" opacity="0.3"/>` +
    `<path d="M ${x - 6} 172 L ${x + 6} 172 L ${x + 5} 178 Q ${x + 18} 186 ${x + 15} 200 Q ${x + 12} 210 ${x + 4} 214 L ${x - 4} 214 Q ${x - 12} 210 ${x - 15} 200 Q ${x - 18} 186 ${x - 5} 178 Z" fill="#b5653a"/>` +
    `<path d="M ${x - 6} 176 Q ${x - 16} 174 ${x - 13} 186" stroke="#8a4a2a" stroke-width="2.4" fill="none"/>` +
    `<path d="M ${x + 6} 176 Q ${x + 16} 174 ${x + 13} 186" stroke="#8a4a2a" stroke-width="2.4" fill="none"/>` +
    `<rect x="${x - 15}" y="190" width="30" height="8" fill="#1a1410"/>` +
    `<path d="M ${x - 13} 196 h 3 v -4 h 3 v 4 h 3 v -4 h 3 v 4 h 3 v -4 h 3 v 4 h 3 v -4 h 3" stroke="#d98a5a" stroke-width="0.8" fill="none"/>` +
    `<rect x="${x - 7}" y="170" width="14" height="3" fill="#8a4a2a"/>`
  )
}

// The quiet band's small picture: Claude blinking beside a beating pixel heart.
// Drawn the same way as the stage, so the surface is ready when the song starts.
export function badge() {
  const u = 3.5
  const eye = (x: number) =>
    `<rect x="${x}" y="1" width="1" height="1" fill="#000"><animate attributeName="height" values="1;1;0.25;1" keyTimes="0;0.93;0.96;1" dur="4.3s" repeatCount="indefinite"/></rect>`
  const legs = [0, 2, 5, 7].map(x => box(x, 6, 1, 2, ORANGE)).join('')
  const heart = [[1, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [1, 2], [2, 2], [3, 2], [2, 3]]
    .map(([x, y]) => box(x ?? 0, y ?? 0, 1, 1, '#ff4d78'))
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 32" width="64" height="32">
<g transform="translate(9 2) scale(${u})" shape-rendering="crispEdges">${box(0, 0, 8, 6, ORANGE)}${box(-2, 2, 2, 2, ORANGE)}${box(8, 2, 2, 2, ORANGE)}${legs}${eye(1)}${eye(6)}</g>
<g transform="translate(52 12)"><g shape-rendering="crispEdges"><animateTransform attributeName="transform" type="scale" values="2;2.4;2" dur="1.2s" repeatCount="indefinite"/><g transform="translate(-2.5 -2)">${heart}</g></g></g>
</svg>`
}

export function band(runId: number, song: Song) {
  const SCENERY = SCENERIES[song.scenery]
  const AMBIENCE = AMBIENCES[ambienceOf(song)]
  const SONG = song
  TUNED = { SONG, SCENERY, AMBIENCE, BASS_AT: song.bassAt ?? 2 * song.bar, DRUMS_AT: song.drumsAt ?? 6 * song.bar, CRASHES: [10 * song.bar, 13 * song.bar], BAND_END: 15 * song.bar }
  try {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}"><!-- run ${runId} --><!-- song ${song.id} -->
${DEFS}${AMBIENCE.defs ?? ''}${SCENERY.defs ?? ''}
<g clip-path="url(#stage)">
${room()}
${neon()}
${lights()}
${drummer()}
${bassist()}
${keyboardist()}
${amp()}
<g transform="translate(${ROSE_X} 216) scale(0.36) translate(-300 -545)">${SCENERY.prop(SONG)}</g>
${singer()}${SCENERY.overlay ? `<g pointer-events="none">${SCENERY.overlay(SONG)}</g>` : ''}
${taps()}
</g>
</svg>`
  } finally {
    TUNED = null
  }
}
