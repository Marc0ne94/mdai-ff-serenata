import type { Song } from './song'
import { partsOf, sectionsOf } from './song'

// What every drawing of the stage is built with: fonts, colors, timing and
// the small helpers that write SVG.
// The stage's size, in the units every drawing of it uses.
export const WIDTH = 1080
export const HEIGHT = 224

export const FONT = "-apple-system, 'Helvetica Neue', Helvetica, sans-serif"
export const NEON = "'Avenir Next Condensed', Futura, 'Helvetica Neue', sans-serif"
export const GOLD = '#ffd166'
export const ORANGE = '#cf7b5c'
export const SKIN = '#e9a17f'

export const sec = (t: number) => `${Math.max(0, t).toFixed(2)}s`
export const n1 = (x: number) => x.toFixed(1)

export function random(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const box = (x: number, y: number, w: number, h: number, fill: string, extra = '') =>
  `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="${fill}"${extra}/>`

export const grow = (begin: number, dur: number) =>
  `<animateTransform attributeName="transform" type="scale" from="0" to="1" begin="${sec(begin)}" dur="${sec(dur)}" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.2 0.8 0.3 1"/>`

// A step back and forth every `dur`, between `begin` and `end`, as pixel art moves.
export const toggle = (attribute: string, values: string, dur: number, begin: number, end: number) =>
  `<animate attributeName="${attribute}" values="${values}" dur="${sec(dur)}" begin="${sec(begin)}" end="${sec(end)}" calcMode="discrete" repeatCount="indefinite"/>`
export const shift = (values: string, dur: number, begin: number, end: number) =>
  `<animateTransform attributeName="transform" type="translate" values="${values}" dur="${sec(dur)}" begin="${sec(begin)}" end="${sec(end)}" calcMode="discrete" repeatCount="indefinite"/>`

export const petal = (l: number, w: number) =>
  `M0 0 C ${n1(-w)} ${n1(-l * 0.2)} ${n1(-w * 1.1)} ${n1(-l * 0.85)} 0 ${n1(-l)} C ${n1(w * 1.1)} ${n1(-l * 0.85)} ${n1(w)} ${n1(-l * 0.2)} 0 0 Z`

// When a song's drops start and when what lights up for them goes out: as
// each ends, or a moment into the outro for the one that runs into it; as
// begin lists of an animation. Drops one after the other light as one: an
// end and a start at the same moment would leave the second dark.
export function dropLights(song: Song) {
  const spans: [number, number][] = []
  for (const { start, end } of partsOf(song, 'drop')) {
    const last = spans.at(-1)
    if (last && Math.abs(last[1] - start) < 0.01) last[1] = end
    else spans.push([start, end])
  }
  return {
    spans,
    on: spans.map(([start]) => sec(start)).join(';'),
    off: spans.map(([, end]) => sec(end >= song.outroAt - 0.01 ? song.outroAt + 1 : end)).join(';'),
    first: spans[0]?.[0] ?? song.finaleAt,
  }
}

// When the rave band's kick plays (see tools/synth.mjs): from the song's
// first kick through every section but the breaks, until the outro; as begin
// and end lists of an animation.
export function kickSpans(song: Song) {
  const from = song.drumsAt ?? 0
  const spans: [number, number][] = []
  for (const { part, start, end } of sectionsOf(song)) {
    if (part === 'break' || part === 'outro' || end <= from) continue
    const last = spans.at(-1)
    if (last && Math.abs(last[1] - start) < 0.01) last[1] = end
    else spans.push([Math.max(start, from), end])
  }
  return { begin: spans.map(([b]) => sec(b)).join(';'), end: spans.map(([, e]) => sec(e)).join(';') }
}

// Texts shown one after another in the same place, each from its moment
// until the next one's; `attrs` are each text's own attributes.
export function inTurn(items: readonly { at: number; text: string; attrs: string }[]) {
  return items
    .map((item, k) => {
      const next = items[k + 1]
      return (
        `<text ${item.attrs} visibility="${k === 0 ? 'visible' : 'hidden'}">${item.text}` +
        (k > 0 ? `<set attributeName="visibility" to="visible" begin="${sec(item.at)}" fill="freeze"/>` : '') +
        (next === undefined ? '' : `<set attributeName="visibility" to="hidden" begin="${sec(next.at)}" fill="freeze"/>`) +
        `</text>`
      )
    })
    .join('')
}

export const LEAF = 'M0 0 C -14 -16 -36 -18 -50 -8 C -36 4 -16 6 0 0 Z'

// A scenery: what a song puts on the stage around the band, which stays the same.
// Each piece follows the song's timing, as the rest of the stage does.
export type Scenery = {
  // The neon sign above the stage: while the song plays, then in its closing bars.
  neon: readonly [string, string]
  // <defs> of its own, its ids starting with its name; drawn after the stage's.
  defs?: string
  // The right-hand wall, inside the frame x 606..702, y 16..102, drawn with
  // the room's random numbers (the garland draws with them next).
  wall: (song: Song, r: () => number) => string
  // The piece beside the singer, in a frame of its own: 400 wide, standing on
  // the floor at (300, 545), drawn at 0.36 of its size.
  prop: (song: Song) => string
  // What crosses the whole stage, over the band, in the stage's own frame
  // (1080 × 224); it takes no taps, which reach the singer beneath.
  overlay?: (song: Song) => string
  // What 5 quick taps put in the singer's free hand: rows of 9 pixels, 15
  // rows, the hand at column 4 of the last rows; each letter a color, '.' none.
  gadget: { pixels: readonly string[]; colors: Readonly<Record<string, string>> }
}

// An ambience: the place an album plays in, the same for all its songs. The
// room around the band, its lights and sign, and how the Claudes look and what
// they play. What it leaves out is the band's own club, as first drawn.
export type Ambience = {
  // <defs> of its own, its ids starting with its name; drawn after the stage's.
  defs?: string
  // The room behind the band (wall, decorations, floor), 1080 × 150 and the
  // floor below; `wall` draws the song's scenery wall where the window goes.
  room?: (song: Song, wall: (r: () => number) => string) => string
  // The gradients of the two side beams, left and right.
  beams?: readonly [string, string]
  // The colours of the sign above the stage.
  sign?: { fill: string; stroke: string }
  // What each Claude wears on its head, in its own cells (8 wide, row 0 the top of its head).
  crown?: string
  // The instruments the band plays: the club's, or the ancient ones.
  instruments?: 'band' | 'antica'
  // The colours of the drummer's riser, its face and its top edge.
  riser?: { fill: string; edge: string }
  // What stands in front of the band, over it (a crowd), in the stage's own
  // frame; it takes no taps, which reach the singer beneath.
  front?: (song: Song) => string
}
