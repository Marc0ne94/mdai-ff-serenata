import { SONG } from './song'

// The stage the band draws while the song plays: a band of pixel Claudes at
// the back (bass, drums on a riser, keys), the singer and the rose in front.
// Its timeline is the song's: every animation
// counts from the moment the drawing appears, as the audio does.
const WIDTH = 1080
const HEIGHT = 224
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

// When each part plays, as tools/synth.mjs arranges the song.
const BASS_AT = 2 * SONG.bar
const DRUMS_AT = 6 * SONG.bar
const CRASHES = [10 * SONG.bar, 13 * SONG.bar]
const BAND_END = 15 * SONG.bar

const FONT = "-apple-system, 'Helvetica Neue', Helvetica, sans-serif"
const NEON = "'Avenir Next Condensed', Futura, 'Helvetica Neue', sans-serif"
const GOLD = '#ffd166'
const ORANGE = '#cf7b5c'
const SKIN = '#e9a17f'

const sec = (t: number) => `${Math.max(0, t).toFixed(2)}s`
const n1 = (x: number) => x.toFixed(1)

function random(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const box = (x: number, y: number, w: number, h: number, fill: string, extra = '') =>
  `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="${fill}"${extra}/>`

const grow = (begin: number, dur: number) =>
  `<animateTransform attributeName="transform" type="scale" from="0" to="1" begin="${sec(begin)}" dur="${sec(dur)}" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.2 0.8 0.3 1"/>`

// A step back and forth every `dur`, between `begin` and `end`, as pixel art moves.
const toggle = (attribute: string, values: string, dur: number, begin: number, end: number) =>
  `<animate attributeName="${attribute}" values="${values}" dur="${sec(dur)}" begin="${sec(begin)}" end="${sec(end)}" calcMode="discrete" repeatCount="indefinite"/>`
const shift = (values: string, dur: number, begin: number, end: number) =>
  `<animateTransform attributeName="transform" type="translate" values="${values}" dur="${sec(dur)}" begin="${sec(begin)}" end="${sec(end)}" calcMode="discrete" repeatCount="indefinite"/>`

const petal = (l: number, w: number) =>
  `M0 0 C ${n1(-w)} ${n1(-l * 0.2)} ${n1(-w * 1.1)} ${n1(-l * 0.85)} 0 ${n1(-l)} C ${n1(w * 1.1)} ${n1(-l * 0.85)} ${n1(w)} ${n1(-l * 0.2)} 0 0 Z`

const LEAF = 'M0 0 C -14 -16 -36 -18 -50 -8 C -36 4 -16 6 0 0 Z'

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
  const r = random(7)
  let stars = ''
  for (let i = 0; i < 9; i++) {
    stars += `<circle cx="${n1(614 + r() * 82)}" cy="${n1(22 + r() * 40)}" r="0.8" fill="#fff"><animate attributeName="opacity" values="0.2;1;0.2" dur="${n1(2 + r() * 3)}s" begin="${n1(r() * 3)}s" repeatCount="indefinite"/></circle>`
  }
  let city = ''
  const towers: [number, number, number][] = [[612, 62, 14], [628, 50, 12], [642, 70, 16], [660, 56, 12], [674, 66, 22]]
  for (const [x, top, w] of towers) {
    city += box(x, top, w, 98 - top, '#120c26')
    for (let wy = top + 4; wy < 94; wy += 7) {
      for (let wx = x + 3; wx < x + w - 2; wx += 5) {
        if (r() < 0.35) city += box(wx, wy, 2, 3, '#f7c96b', ' opacity="0.8"')
      }
    }
  }
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
<g transform="translate(${WIDTH - 720} 0)"><rect x="606" y="16" width="96" height="86" fill="#3a2a55"/><rect x="610" y="20" width="88" height="78" fill="url(#night)"/>${stars}${city}<rect x="653" y="20" width="2" height="78" fill="#3a2a55"/></g>
<polyline points="${wire.join(' ')}" fill="none" stroke="#3a2a55" stroke-width="1.2"/>${garland}
<text x="16" y="17" font-family="Menlo, 'SF Mono', monospace" font-weight="700" font-size="11" letter-spacing="1.5" fill="#ffd6f3" filter="url(#neon)">M2V-MDO</text>
<rect x="44" y="26" width="51" height="46" fill="#2b1c40" stroke="#4a3566" stroke-width="3"/>${pixelHeart}
<rect y="150" width="${WIDTH}" height="${HEIGHT - 150}" fill="url(#floor)"/><rect y="150" width="${WIDTH}" height="2" fill="#4c3270"/>`
}

function neon() {
  const sign = (text: string, extra: string) =>
    `<text x="${CX}" y="46" text-anchor="middle" font-family="${NEON}" font-weight="700" font-size="22" letter-spacing="4" fill="#ffe3f6" stroke="#ff4fc3" stroke-width="0.8" filter="url(#neon)" opacity="0">${text}${extra}</text>`
  return (
    sign(
      'CLAUDE CANTA',
      `<animate attributeName="opacity" values="0;1;0.2;1;0.4;1" keyTimes="0;0.2;0.35;0.5;0.7;1" dur="1.2s" begin="0.2s" fill="freeze"/>` +
        `<animate attributeName="opacity" from="1" to="0" begin="${sec(SONG.outroAt + 0.4)}" dur="0.6s" fill="freeze"/>`,
    ) +
    sign(
      'PER TE ♥',
      `<animate attributeName="opacity" values="0;1;0.3;1" keyTimes="0;0.4;0.6;1" dur="1s" begin="${sec(SONG.outroAt + 1)}" fill="freeze"/>`,
    )
  )
}

function lights() {
  const { beat, finaleAt, outroAt } = SONG
  const beam = (x: number, fill: string, values: string, begin: number) =>
    `<polygon points="${x - 12},0 ${x + 12},0 ${x + 62},218 ${x - 62},218" fill="url(#${fill})" opacity="0">` +
    `<animate attributeName="opacity" from="0" to="0.35" begin="${sec(begin)}" dur="1.5s" fill="freeze"/>` +
    toggle('opacity', values, 2 * beat, finaleAt, outroAt) +
    `</polygon>`
  const spot =
    `<polygon points="${SINGER_X - 14},0 ${SINGER_X + 14},0 ${SINGER_X + 78},218 ${SINGER_X - 78},218" fill="url(#beamWhite)" opacity="0">` +
    `<animate attributeName="opacity" from="0" to="0.8" begin="${sec(BASS_AT - 0.8)}" dur="1.5s" fill="freeze"/></polygon>`
  return beam(BASS_X, 'beamPurple', '0.6;0.2', BASS_AT) + beam(KEYS_X, 'beamPink', '0.2;0.6', DRUMS_AT) + spot
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
  const eye = (x: number) =>
    `<rect x="${x}" y="1" width="1" height="1" fill="#000"><animate attributeName="height" values="1;1;0.25;1" keyTimes="0;0.93;0.96;1" dur="4.3s" begin="${sec(blink)}" repeatCount="indefinite"/><animate attributeName="y" values="1;1;1.375;1" keyTimes="0;0.93;0.96;1" dur="4.3s" begin="${sec(blink)}" repeatCount="indefinite"/></rect>`
  const legs = [0, 2, 5, 7].map(x => box(x, 6, 1, 2, ORANGE)).join('')
  const motion = hop ? shift('0 0;0 -0.5', hop.dur, hop.begin, hop.end) : ''
  return `<ellipse cx="${cx}" cy="${feet}" rx="${6 * u}" ry="${u * 0.5}" fill="#000" opacity="0.3"/>
<g transform="translate(${cx - 4 * u} ${feet - 8 * u}) scale(${u})" shape-rendering="crispEdges"><g>${motion}
${box(0, 0, 8, 6, ORANGE)}${arms ?? box(-2, 2, 2, 2, ORANGE) + box(8, 2, 2, 2, ORANGE)}${legs}${eye(1)}${eye(6)}${face ?? ''}${front ?? ''}
</g></g>`
}

// How far the singer's mouth opens over the whole clip, 0 to 1.
function mouthTrack() {
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

// A flower for the singer's other hand: quick taps on the singer bring it out.
const TULIP = [
  'R...M...R',
  'RR.MMM.RR',
  '.RRRMRRR.',
  '.RRRRRRR.',
  '..DRRRD..',
  '....S....',
  '....S....',
  '.LL.S....',
  '..LLS....',
  '....S....',
  '....S.LL.',
  '....SLL..',
  '....S....',
  '....S....',
  '....S....',
]
const TULIP_COLORS: Record<string, string> = { R: '#e0245e', M: '#ff6f91', D: '#a3123c', S: '#3a9a4a', L: '#4caf50' }
const TAPS = 5
const TAP_WINDOW = 2.5

function singer() {
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
  const pixels = TULIP.flatMap((row, y) =>
    [...row].map((c, x) => {
      const fill = TULIP_COLORS[c]
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
  const { beat, outroAt } = SONG
  const stickArm = (x: number, stick: string, values: string) =>
    `<g>${shift(values, beat, DRUMS_AT, outroAt)}${box(x, 2, 2, 2, ORANGE)}<line ${stick} stroke="#efd9a7" stroke-width="0.35"/></g>`
  const arms =
    stickArm(-2, 'x1="-1.5" y1="2.2" x2="-3.6" y2="0.4"', '0 -0.8;0 0.6') +
    stickArm(8, 'x1="9.5" y1="2.2" x2="11.6" y2="0.4"', '0 0.6;0 -0.8')
  const x = DRUMS_X
  const riser = `<rect x="${x - 72}" y="128" width="144" height="22" fill="#2e1f45"/><rect x="${x - 72}" y="128" width="144" height="2" fill="#5b3d86"/>`
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
  const { beat, outroAt } = SONG
  return (
    `<rect x="${AMP_X}" y="176" width="46" height="38" rx="3" fill="#1e1a26" stroke="#3a3348"/>` +
    `<rect x="${AMP_X + 4}" y="179" width="38" height="4" fill="#3a3348"/>` +
    `<g transform="translate(${AMP_X + 23} 199)"><g><animateTransform attributeName="transform" type="scale" values="1.15;1;1;1.15;1;1" keyTimes="0;0.15;0.5;0.5;0.65;1" dur="${sec(2 * beat)}" begin="${sec(DRUMS_AT)}" end="${sec(outroAt)}" repeatCount="indefinite"/>` +
    `<circle r="11" fill="#2d2838" stroke="#4a4258" stroke-width="2"/><circle r="4" fill="#4a4258"/></g></g>`
  )
}

// ---------- the rose ----------

// The rose in its pot, drawn in a 400-wide scene of its own (pot standing at 300,545).
function flower() {
  const { bloomAt, finaleAt, beat, bar } = SONG
  const pot = `<g transform="translate(300 545)"><path d="M -34 -46 L 34 -46 L 26 0 L -26 0 Z" fill="url(#pot)"/><rect x="-38" y="-54" width="76" height="12" rx="3" fill="#c6643f"/><ellipse cx="0" cy="-54" rx="34" ry="4" fill="#3a2016"/></g>`
  const stem =
    `<path d="M300 491 C 288 440, 314 380, 300 302" stroke="#3a9a4a" stroke-width="5" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1">` +
    `<animate attributeName="stroke-dashoffset" from="1" to="0" begin="1s" dur="13s" fill="freeze"/></path>`
  const leaf = (x: number, y: number, mirror: boolean, begin: number) =>
    `<g transform="translate(${x} ${y})${mirror ? ' scale(-1 1)' : ''}"><g transform="scale(0)">${grow(begin, 1.6)}<path d="${LEAF}" fill="#3fa34d"/><path d="M0 0 C -16 -6 -32 -8 -46 -7" stroke="#2d6a33" stroke-width="1.5" fill="none"/></g></g>`
  const sepals = [-50, 0, 50]
    .map(a => `<path d="M0 0 C -5 8 -14 14 -22 13 C -14 6 -6 0 0 0 Z" transform="rotate(${a})" fill="#3a9a4a"/>`)
    .join('')
  const bud =
    `<g transform="translate(300 302)"><g transform="scale(0)">${grow(13.5, 1.5)}${sepals}</g></g>` +
    `<g transform="translate(300 300)"><g><animate attributeName="opacity" from="1" to="0" begin="${sec(bloomAt + 0.8)}" dur="1.2s" fill="freeze"/>` +
    `<g transform="scale(0)">${grow(14, 2)}<animateTransform attributeName="transform" type="scale" from="1" to="1.25" begin="19s" dur="6s" fill="freeze"/>` +
    `<path d="M0 4 C -14 0 -14 -26 0 -34 C 14 -26 14 0 0 4 Z" fill="url(#petal2)"/></g></g></g>`
  const ring = (count: number, offset: number, length: number, width: number, fill: string, start: number, step: number) =>
    Array.from({ length: count }, (_, i) => {
      const angle = offset + (360 / count) * i
      return `<g transform="rotate(${n1(angle)})"><path d="${petal(length, width)}" fill="${fill}" transform="scale(0)">${grow(start + i * step, 1.6)}</path></g>`
    }).join('')
  const bloom =
    `<g transform="translate(300 300)">` +
    ring(6, 0, 50, 22, 'url(#petal)', bloomAt, 0.3) +
    ring(6, 30, 38, 18, 'url(#petal2)', bloomAt + 2.2, 0.25) +
    ring(4, 45, 24, 12, '#a3123c', bloomAt + 4, 0.2) +
    `<g transform="scale(0)">${grow(bloomAt + 5, 1.2)}<circle r="9" fill="#6e0a2a"/><path d="M -4 0 a 4 4 0 1 1 8 0 a 6 6 0 1 1 -12 0" stroke="#ff7aa0" stroke-width="1.5" fill="none" opacity="0.7"/></g>` +
    `</g>`
  const glow =
    `<circle cx="300" cy="295" r="95" fill="url(#glow)" opacity="0">` +
    `<animate attributeName="opacity" from="0" to="0.55" begin="${sec(bloomAt)}" dur="3s" fill="freeze"/>` +
    `<animate attributeName="opacity" values="0.45;0.85;0.45" dur="${sec(2 * beat)}" begin="${sec(finaleAt)}" repeatCount="indefinite"/></circle>`
  const r = random(11)
  let hearts = ''
  for (let i = 0; i < 8; i++) {
    // Each heart floats for 4s and is gone before the closing words appear.
    const begin = [0, 1, 2]
      .map(k => finaleAt + i * 0.7 + k * 5.6)
      .filter(t => t + 4 <= SONG.outroAt + 0.5)
      .map(sec)
      .join(';')
    const dx = Math.round((r() - 0.5) * 140)
    const scale = (0.9 + r() * 0.8).toFixed(2)
    hearts += `<g transform="translate(300 290)"><g opacity="0"><animateTransform attributeName="transform" type="translate" values="0 0;${dx / 2} -60;${dx} -120" dur="4s" begin="${begin}"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.7;1" dur="4s" begin="${begin}"/><use href="#heart" transform="scale(${scale})" fill="${i % 2 ? '#ff6f91' : '#ffb3c7'}"/></g></g>`
  }
  let sparkles = ''
  for (let i = 0; i < 7; i++) {
    const x = 300 + (r() - 0.5) * 170
    const y = 300 + (r() - 0.5) * 150
    sparkles += `<g transform="translate(${n1(x)} ${n1(y)})"><use href="#sparkle" fill="#fff3b0" transform="scale(0)"><animateTransform attributeName="transform" type="scale" values="0;1.2;0" dur="1.6s" begin="${sec(finaleAt + r() * 2)}" repeatCount="indefinite"/></use></g>`
  }
  const sway = `<animateTransform attributeName="transform" type="rotate" values="0 300 491;2 300 491;0 300 491;-2 300 491;0 300 491" dur="${sec(2 * bar)}" begin="${sec(finaleAt)}" repeatCount="indefinite"/>`
  return `${glow}<g>${sway}${pot}${stem}${leaf(297, 442, false, 5.5)}${leaf(303, 388, true, 9)}${bud}${bloom}</g>${hearts}${sparkles}`
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

export function band(runId: number) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}"><!-- run ${runId} -->
${DEFS}
<g clip-path="url(#stage)">
${room()}
${neon()}
${lights()}
${drummer()}
${bassist()}
${keyboardist()}
${amp()}
<g transform="translate(${ROSE_X} 216) scale(0.36) translate(-300 -545)">${flower()}</g>
${singer()}
${taps()}
</g>
</svg>`
}
