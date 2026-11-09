import type { Scenery } from '../draw'
import { dropLights, inTurn, kickSpans, n1, NEON, sec } from '../draw'
import type { Song } from '../song'
import { partsOf, sectionsOf } from '../song'

// The scenery of «Centottanta»: in the window a battery charging, a cell more
// with each line until the first drop fills it, overcharged at 200% in the
// last, shaking and throwing sparks, the beats a minute beneath it (in Italian
// a battery and a drum kit are both a «batteria»); beside the singer a stack
// of speakers pumping with the kick, harder in the last drop, POM! popping out
// of it on every sung «pom» and through the drops; a glow stick for the
// singer's hand.

const MONO = "Menlo, 'SF Mono', monospace"
const GREEN = '#39ff88'
const MAGENTA = '#ff3fd8'

const DEFS = `<defs>
<radialGradient id="batteriaGlow"><stop offset="0" stop-color="${MAGENTA}" stop-opacity="0.55"/><stop offset="1" stop-color="${MAGENTA}" stop-opacity="0"/></radialGradient>
</defs>`

const beatOf = (song: Song) => song.pulse ?? song.beat
// The kick's last, on the last bar.
const lastKick = (song: Song) => (sectionsOf(song).at(-1)?.end ?? 16 * song.bar) - song.bar
// The last drop, the biggest, when there is more than one.
const overcharge = (song: Song) => {
  const drops = partsOf(song, 'drop')
  return drops.length > 1 ? drops.at(-1) : undefined
}

// ---------- the battery in the window ----------

const CELLS = ['#ff3b3b', '#ff8a2b', '#ffd23b', '#b6ff3b', GREEN]

function battery(song: Song) {
  const beat = beatOf(song)
  const drops = partsOf(song, 'drop')
  const full = drops[0]?.start ?? song.finaleAt
  // A cell for each quarter of the lines before the first drop, the last at the drop.
  const before = song.lines.filter(line => line.start < full)
  const at = [0, 1, 2, 3].map(i => before[Math.floor((i * before.length) / 4)]?.start ?? full).concat(full)
  // Overcharged in the last drop, when there is more than one.
  const over = overcharge(song)?.start
  const lit = dropLights(song)
  let cells = ''
  CELLS.forEach((color, i) => {
    cells +=
      `<rect x="${n1(624.5 + i * 11.2)}" y="48" width="9" height="22" fill="${color}" opacity="0">` +
      `<set attributeName="opacity" to="1" begin="${sec(at[i] ?? full)}" fill="freeze"/>` +
      `<set attributeName="fill" to="${GREEN}" begin="${sec(full)}" fill="freeze"/>` +
      (over === undefined ? '' : `<set attributeName="fill" to="${MAGENTA}" begin="${sec(over)}" fill="freeze"/>`) +
      `<animate attributeName="opacity" values="1;0.55;1" dur="${sec(2 * beat)}" begin="${lit.on}" end="${lit.off}" repeatCount="indefinite"/></rect>`
  })
  // The charge in figures, each shown until the next: 0% to 100%, then 200%.
  const levels: [number, number, string][] = [0, ...at].map((t, k) => [t, k * 20, k === CELLS.length ? GREEN : '#cfd3e6'])
  if (over !== undefined) levels.push([over, 200, MAGENTA])
  const figures = inTurn(
    levels.map(([at, percent, color]) => ({
      at,
      text: `${percent}%`,
      attrs: `x="654" y="38" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="11" fill="${color}"`,
    })),
  )
  // A bolt over the cells, flickering while it charges and steady once full.
  const bolt =
    `<polygon points="656,45 645,61 652,61 647,73 659,56 652,56" fill="#fff8c4" stroke="#06060c" stroke-width="1">` +
    `<animate attributeName="opacity" values="0.9;0.35;0.9" dur="${sec(2 * beat)}" end="${sec(full)}" repeatCount="indefinite"/></polygon>`
  // The beats a minute, a heart beating with them while the kick plays.
  const kick = kickSpans(song)
  const bpm =
    `<g transform="translate(626 88)"><g><animateTransform attributeName="transform" type="scale" values="1.35;1;1" keyTimes="0;0.4;1" dur="${sec(beat)}" begin="${kick.begin}" end="${kick.end}" repeatCount="indefinite"/>` +
    `<use href="#heart" transform="translate(0 -6) scale(0.5)" fill="${MAGENTA}"/></g></g>` +
    `<text x="634" y="92" font-family="${MONO}" font-weight="700" font-size="9" fill="${MAGENTA}">${Math.round(60 / beat)} BPM</text>`
  // Overcharged it shakes on every beat, its case turns magenta, a bolt pulses
  // over it and sparks fly off it.
  let surge = ''
  let shake = ''
  const until = song.outroAt + 1
  const turn = (attribute: string) => (over === undefined ? '' : `<set attributeName="${attribute}" to="${MAGENTA}" begin="${sec(over)}" fill="freeze"/>`)
  if (over !== undefined) {
    shake = `<animateTransform attributeName="transform" type="translate" values="0 0;-1.6 0.6;1.6 -0.6;0 0" dur="${sec(beat)}" begin="${sec(over)}" end="${sec(until)}" repeatCount="indefinite"/>`
    surge =
      `<g opacity="0"><set attributeName="opacity" to="1" begin="${sec(over)}" end="${sec(until)}"/>` +
      `<g transform="translate(651 59)"><g><animateTransform attributeName="transform" type="scale" values="1.5;1.1;1.1" keyTimes="0;0.4;1" dur="${sec(beat)}" begin="${sec(over)}" end="${sec(until)}" repeatCount="indefinite"/>` +
      `<polygon points="5,-14 -6,2 1,2 -4,14 8,-3 1,-3" fill="#fff" stroke="${MAGENTA}" stroke-width="1.5"/></g></g></g>`
    ;[
      [616, 40], [690, 42], [612, 78], [692, 76], [652, 30], [640, 86],
    ].forEach(([x, y], i) => {
      surge +=
        `<g transform="translate(${x} ${y})"><use href="#sparkle" fill="${i % 2 ? '#fff8c4' : MAGENTA}" transform="scale(0)">` +
        `<animateTransform attributeName="transform" type="scale" values="0;1;0" dur="${sec(2 * beat)}" begin="${sec(over + (i * beat) / 3)}" end="${sec(until)}" repeatCount="indefinite"/></use></g>`
    })
  }
  const outline =
    `<rect x="620.5" y="44" width="61" height="30" rx="3" fill="none" stroke="#cfd3e6" stroke-width="2.5">${turn('stroke')}</rect>` +
    `<rect x="683" y="53" width="5" height="12" rx="1" fill="#cfd3e6">${turn('fill')}</rect>`
  return (
    `<rect x="606" y="16" width="96" height="86" fill="#1c1a28"/><rect x="610" y="20" width="88" height="78" fill="#06060c"/>` +
    `<g><g>${shake}${outline}${cells}${bolt}</g>${figures}</g>${surge}${bpm}`
  )
}

// ---------- the speakers beside the singer ----------

function speakers(song: Song) {
  const beat = beatOf(song)
  const kick = kickSpans(song)
  const lit = dropLights(song)
  // Each cone kicks out with the kick and settles before the next; further out
  // in the last drop.
  const biggest = overcharge(song)
  const pump = (scale: number) =>
    `<animateTransform attributeName="transform" type="scale" values="${scale};1;1" keyTimes="0;0.4;1" dur="${sec(beat)}" begin="${kick.begin}" end="${kick.end}" repeatCount="indefinite"/>` +
    (biggest
      ? `<animateTransform attributeName="transform" type="scale" values="${(1 + (scale - 1) * 2).toFixed(2)};1;1" keyTimes="0;0.4;1" dur="${sec(beat)}" begin="${sec(biggest.start)}" end="${sec(biggest.end)}" repeatCount="indefinite"/>`
      : '') +
    `<animateTransform attributeName="transform" type="scale" values="${scale + 0.06};1" dur="${sec(2 * beat)}" begin="${sec(lastKick(song))}" fill="freeze"/>`
  const cone = (cx: number, cy: number, r: number, scale: number) =>
    `<circle cx="${cx}" cy="${cy}" r="${r + 5}" fill="#2b2738"/>` +
    `<g transform="translate(${cx} ${cy})"><g>${pump(scale)}` +
    `<circle r="${r}" fill="#0a090e"/><circle r="${n1(r * 0.62)}" fill="#14121c" stroke="#2b2738" stroke-width="2"/><circle r="${n1(r * 0.26)}" fill="#2b2738"/></g></g>` +
    `<circle cx="${cx}" cy="${cy}" r="${r + 3}" fill="none" stroke="${MAGENTA}" stroke-width="2.5" opacity="0">` +
    `<set attributeName="opacity" to="0.9" begin="${lit.on}" fill="freeze"/><set attributeName="opacity" to="0" begin="${lit.off}" fill="freeze"/></circle>`
  const stack =
    `<ellipse cx="300" cy="545" rx="125" ry="6" fill="#000" opacity="0.35"/>` +
    `<rect x="196" y="370" width="208" height="175" rx="6" fill="#121019" stroke="#2b2738" stroke-width="4"/>` +
    cone(300, 457, 64, 1.12) +
    `<rect x="214" y="262" width="172" height="108" rx="6" fill="#121019" stroke="#2b2738" stroke-width="4"/>` +
    `<rect x="278" y="274" width="44" height="18" rx="4" fill="#0a090e" stroke="#2b2738" stroke-width="2"/>` +
    cone(258, 326, 26, 1.1) +
    cone(342, 326, 26, 1.1)
  // A glow behind the stack through each drop.
  const glow =
    `<circle cx="300" cy="400" r="170" fill="url(#batteriaGlow)" opacity="0">` +
    `<set attributeName="opacity" to="0.6" begin="${lit.on}" fill="freeze"/><set attributeName="opacity" to="0" begin="${lit.off}" fill="freeze"/>` +
    `<animate attributeName="opacity" values="0.75;0.4;0.75" dur="${sec(2 * beat)}" begin="${lit.on}" end="${lit.off}" repeatCount="indefinite"/></circle>`
  // POM!: on every «pom» the voice sings, and every three beats of the drops,
  // from three places above the stack in turn.
  const sung = song.lines.flatMap(line => line.syls.filter(s => /^pom/i.test(s.text)).map(s => s.start))
  const extra: number[] = []
  for (const drop of partsOf(song, 'drop')) {
    for (let t = drop.start; t < Math.min(drop.end, song.outroAt) - beat; t += 3 * beat) if (!sung.some(s => Math.abs(s - t) < beat)) extra.push(t)
  }
  const times = [...sung, ...extra].sort((a, b) => a - b)
  const spots = [
    [226, 236, -10],
    [374, 226, 9],
    [300, 196, 0],
  ] as const
  let poms = ''
  spots.forEach(([x, y, tilt], i) => {
    const begins = times.filter((_, k) => k % spots.length === i).map(sec)
    if (begins.length === 0) return
    poms +=
      `<g transform="translate(${x} ${y}) rotate(${tilt})"><g transform="scale(0)">` +
      `<animateTransform attributeName="transform" type="scale" values="0;1.25;1;0" keyTimes="0;0.25;0.7;1" dur="${sec(1.6 * beat)}" begin="${begins.join(';')}"/>` +
      `<text y="13" text-anchor="middle" font-family="${NEON}" font-weight="800" font-size="40" fill="#ffe14d" stroke="${MAGENTA}" stroke-width="2.5" paint-order="stroke">POM!</text></g></g>`
  })
  return `${glow}${stack}${poms}`
}

// ---------- the glow stick for the singer's hand ----------

const STICK = [
  '.........',
  '.........',
  '....G....',
  '...GLG...',
  '...GLG...',
  '...GLG...',
  '...GLG...',
  '...GLG...',
  '...GLG...',
  '...GLG...',
  '...GLG...',
  '....G....',
  '...KKK...',
  '...KKK...',
  '.........',
]
const STICK_COLORS: Record<string, string> = { G: GREEN, L: '#d9ffe9', K: '#2b2738' }

export const BATTERIA: Scenery = {
  neon: ['CENTOTTANTA', 'CARICA AL 100%'],
  defs: DEFS,
  wall: battery,
  prop: speakers,
  gadget: { pixels: STICK, colors: STICK_COLORS },
}
