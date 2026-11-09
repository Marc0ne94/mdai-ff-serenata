import type { Scenery } from '../draw'
import { dropLights, inTurn, kickSpans, n1, random, sec } from '../draw'
import type { Song } from '../song'
import { partsOf } from '../song'

// The scenery of «Venerdì»: in the window a clock on Friday, two minutes on
// with each line until it strikes 18:00 at the first drop, WEEKEND in the
// last, a sun rising beneath it; beside the singer a big smiling balloon,
// bouncing with the kick, winking at each drop, in dark glasses for the last;
// confetti over the whole stage through the last drop; a spritz for the
// singer's hand.

const MONO = "Menlo, 'SF Mono', monospace"
const AMBER = '#ffb347'
const GREEN = '#39ff88'
const YELLOW = '#ffd23b'

const DEFS = `<defs>
<clipPath id="venerdiWindow"><rect x="610" y="20" width="88" height="78"/></clipPath>
<radialGradient id="venerdiGlow"><stop offset="0" stop-color="${YELLOW}" stop-opacity="0.5"/><stop offset="1" stop-color="${YELLOW}" stop-opacity="0"/></radialGradient>
</defs>`

const beatOf = (song: Song) => song.pulse ?? song.beat

// ---------- the clock in the window ----------

function clock(song: Song) {
  const drops = partsOf(song, 'drop')
  const six = drops[0]?.start ?? song.finaleAt
  const weekend = drops.length > 1 ? drops.at(-1)?.start : undefined
  // Two minutes on with each line before the first drop, so the last one
  // before it reads 17:58 and the drop strikes six.
  const before = song.lines.filter(line => line.start < six)
  const times = [
    { at: 0, text: `17:${60 - 2 * (before.length + 1)}`, color: AMBER, size: 22 },
    ...before.map((line, i) => ({ at: line.start, text: `17:${60 - 2 * (before.length - i)}`, color: AMBER, size: 22 })),
    { at: six, text: '18:00', color: GREEN, size: 22 },
    ...(weekend === undefined ? [] : [{ at: weekend, text: 'WEEKEND!', color: GREEN, size: 13 }]),
  ]
  const shown = inTurn(
    times.map(({ at, text, color, size }) => ({
      at,
      text,
      attrs: `x="654" y="${size === 22 ? 63 : 60}" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="${size}" fill="${color}" filter="url(#neon)"`,
    })),
  )
  // A sun rising under the clock at six.
  const sun =
    `<g transform="translate(654 106)"><g><animateTransform attributeName="transform" type="translate" values="0 0;0 -16" dur="2s" begin="${sec(six)}" fill="freeze"/>` +
    `<circle r="9" fill="${YELLOW}"/></g></g>`
  return (
    `<rect x="606" y="16" width="96" height="86" fill="#2a1f3a"/>` +
    `<g clip-path="url(#venerdiWindow)"><rect x="610" y="20" width="88" height="78" fill="#0d0814"/>${sun}</g>` +
    `<text x="654" y="34" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="9" fill="#a99bc4">VEN</text>` +
    shown
  )
}

// ---------- the smiling balloon beside the singer ----------

function balloon(song: Song) {
  const beat = beatOf(song)
  const drops = partsOf(song, 'drop')
  const last = drops.length > 1 ? drops.at(-1) : undefined
  const kick = kickSpans(song)
  const lit = dropLights(song)
  const bounce = `<animateTransform attributeName="transform" type="translate" values="0 0;0 -14;0 0" dur="${sec(beat)}" begin="${kick.begin}" end="${kick.end}" repeatCount="indefinite"/>`
  // It winks as each drop comes in.
  const wink = `<animate attributeName="ry" values="18;2;18" dur="0.5s" begin="${drops.map(d => sec(d.start)).join(';')}"/>`
  const face =
    `<circle r="95" fill="${YELLOW}" stroke="#e0a800" stroke-width="4"/>` +
    `<ellipse cx="-32" cy="-25" rx="10" ry="18" fill="#1a1a1a"/><ellipse cx="32" cy="-25" rx="10" ry="18" fill="#1a1a1a">${wink}</ellipse>` +
    `<path d="M -55 15 Q 0 78 55 15" stroke="#1a1a1a" stroke-width="10" fill="none" stroke-linecap="round"/>`
  // Dark glasses for the last drop.
  const shades =
    last === undefined
      ? ''
      : `<g opacity="0"><set attributeName="opacity" to="1" begin="${sec(last.start)}" fill="freeze"/>` +
        `<rect x="-62" y="-42" width="52" height="30" rx="6" fill="#111"/><rect x="10" y="-42" width="52" height="30" rx="6" fill="#111"/><rect x="-10" y="-34" width="20" height="6" fill="#111"/>` +
        `<rect x="-52" y="-36" width="14" height="5" fill="#9ffcff"/><rect x="20" y="-36" width="14" height="5" fill="#9ffcff"/></g>`
  // Sparkles around it through the drops.
  let sparkles = ''
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * 2 * Math.PI
    sparkles +=
      `<g transform="translate(${n1(300 + 125 * Math.cos(angle))} ${n1(330 + 115 * Math.sin(angle))})"><use href="#sparkle" fill="#fff3b0" transform="scale(0)">` +
      `<animateTransform attributeName="transform" type="scale" values="0;2;0" dur="${sec(2 * beat)}" begin="${lit.spans.map(([start]) => sec(start + (i * beat) / 3)).join(';')}" end="${lit.off}" repeatCount="indefinite"/></use></g>`
  }
  const glow =
    `<circle cx="300" cy="330" r="170" fill="url(#venerdiGlow)" opacity="0">` +
    `<set attributeName="opacity" to="0.8" begin="${lit.on}" fill="freeze"/><set attributeName="opacity" to="0" begin="${lit.off}" fill="freeze"/></circle>`
  return (
    glow +
    `<ellipse cx="300" cy="545" rx="40" ry="5" fill="#000" opacity="0.35"/>` +
    `<g>${bounce}<path d="M 300 545 Q 290 480 300 425" stroke="#e8e8f0" stroke-width="3" fill="none"/>` +
    `<g transform="translate(300 330)">${face}${shades}</g></g>` +
    sparkles
  )
}

// ---------- the confetti over the stage ----------

// Through the last drop, when there are more: each piece falling and
// fluttering, over and over, the last ones landing in the outro.
function confetti(song: Song) {
  const drops = partsOf(song, 'drop')
  const last = drops.length > 1 ? drops.at(-1) : undefined
  if (last === undefined) return ''
  const r = random(20261113)
  const colors = [YELLOW, '#ff3fd8', '#39d0ff', GREEN, AMBER]
  let pieces = ''
  for (let i = 0; i < 36; i++) {
    const x = n1(r() * 1080)
    const dur = 2.2 + r() * 1.6
    const begin = last.start + r() * dur
    const drift = n1((r() - 0.5) * 60)
    const times = Math.max(1, Math.round((song.outroAt + 1 - begin) / dur))
    pieces +=
      `<rect x="${x}" y="-12" width="6" height="9" fill="${colors[i % colors.length]}">` +
      `<animateTransform attributeName="transform" type="translate" values="0 0;${drift} 248" dur="${sec(dur)}" begin="${sec(begin)}" repeatCount="${times}"/>` +
      `<animate attributeName="width" values="6;1;6" dur="0.5s" repeatCount="indefinite"/></rect>`
  }
  return pieces
}

// ---------- the spritz for the singer's hand ----------

const SPRITZ = [
  '.......P.',
  '......P..',
  '.WWWWPWW.',
  '.WOOOPOW.',
  '.WOOOOOW.',
  '.WOOOOOW.',
  '..WOOOW..',
  '...WOW...',
  '....W....',
  '....W....',
  '....W....',
  '...WWW...',
  '.........',
  '.........',
  '.........',
]
const SPRITZ_COLORS: Record<string, string> = { W: '#e8f4ff', O: '#ff7a1a', P: '#ff3fd8' }

export const VENERDI: Scenery = {
  neon: ['VENERDÌ', 'BUON WEEKEND!'],
  defs: DEFS,
  wall: clock,
  prop: balloon,
  overlay: confetti,
  gadget: { pixels: SPRITZ, colors: SPRITZ_COLORS },
}
