import type { Scenery } from '../draw'
import { grow, LEAF, n1, petal, random, sec, box } from '../draw'
import type { Song } from '../song'

// The Serenata's scenery: a rose that grows and blooms, a window on the city
// at night, and a tulip for the singer.

// The window on the city at night.
function wall(_: Song, r: () => number) {
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
  return `<rect x="606" y="16" width="96" height="86" fill="#3a2a55"/><rect x="610" y="20" width="88" height="78" fill="url(#night)"/>${stars}${city}<rect x="653" y="20" width="2" height="78" fill="#3a2a55"/>`
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

// The rose in its pot, drawn in a 400-wide scene of its own (pot standing at 300,545).
function flower(song: Song) {
  const { bloomAt, finaleAt, beat, bar } = song
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
      .filter(t => t + 4 <= song.outroAt + 0.5)
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


export const ROSA: Scenery = {
  neon: ['CLAUDE CANTA', 'PER TE ♥'],
  wall,
  prop: flower,
  gadget: { pixels: TULIP, colors: TULIP_COLORS },
}
