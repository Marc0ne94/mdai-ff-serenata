import type { Ambience } from '../draw'
import { box, HEIGHT, n1, random, WIDTH } from '../draw'
import type { Song } from '../song'

// The evening ambience, for the MDO album: the Serenata's room on a night of
// its own, the wall a deep wine red, a string of warm lights, rose petals
// drifting down over the stage; rose and gold light, a rose sign; the Claudes
// in crowns of little flowers, playing the band's own instruments.

const DEFS = `<defs>
<linearGradient id="serataWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f0a17"/><stop offset="1" stop-color="#3a1428"/></linearGradient>
<linearGradient id="serataFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1630"/><stop offset="1" stop-color="#1c0a18"/></linearGradient>
<linearGradient id="serataBeamRose" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7aa2" stop-opacity="0.5"/><stop offset="1" stop-color="#ff7aa2" stop-opacity="0"/></linearGradient>
<linearGradient id="serataBeamGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc06a" stop-opacity="0.5"/><stop offset="1" stop-color="#ffc06a" stop-opacity="0"/></linearGradient>
</defs>`

function room(_: Song, wall: (r: () => number) => string) {
  const r = random(11)
  // The scenery's wall draws first, as in the club.
  const window = wall(r)
  // A soft pattern of dots on the wall, as an old damask.
  let damask = ''
  for (let y = 30; y < 150; y += 24) {
    for (let x = (y / 24) % 2 ? 12 : 36; x < WIDTH; x += 48) damask += `<circle cx="${x}" cy="${y}" r="1.6" fill="#5a2340" opacity="0.6"/>`
  }
  // A string of warm lights, gold and rose only.
  let garland = ''
  const wire: string[] = []
  for (let x = 120, i = 0; x <= WIDTH - 130; x += 30, i++) {
    const u = ((x - 120) % 180) / 180
    const y = 6 + 10 * (1 - (2 * u - 1) ** 2)
    wire.push(`${x},${n1(y)}`)
    garland += `<circle cx="${x}" cy="${n1(y + 3)}" r="2.6" fill="${i % 2 ? '#ff9ab8' : '#ffd38a'}"><animate attributeName="opacity" values="0.4;1;0.4" dur="${n1(2 + r() * 2)}s" begin="${n1(r() * 2)}s" repeatCount="indefinite"/></circle>`
  }
  const pixelHeart = [
    [1, 0], [2, 0], [4, 0], [5, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
    [2, 4], [3, 4], [4, 4], [3, 5],
  ]
    .map(([x, y]) => box(52 + (x ?? 0) * 5, 34 + (y ?? 0) * 5, 5, 5, '#ff4f86'))
    .join('')
  // Rose petals drifting down over the whole stage, slowly, all night.
  let petals = ''
  for (let i = 0; i < 12; i++) {
    const x = n1(30 + r() * (WIDTH - 60))
    const dur = n1(9 + r() * 6)
    const begin = n1(r() * 9)
    const sway = Math.round((r() - 0.5) * 60)
    petals +=
      `<g transform="translate(${x} -8)"><g><animateTransform attributeName="transform" type="translate" values="0 0;${sway} ${HEIGHT / 2};${-sway / 2} ${HEIGHT + 16}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>` +
      `<ellipse rx="3" ry="1.8" fill="${i % 3 ? '#e0315e' : '#ff8fb0'}" opacity="0.75"><animateTransform attributeName="transform" type="rotate" values="0;180;360" dur="${n1(3 + r() * 3)}s" repeatCount="indefinite"/></ellipse></g></g>`
  }
  return (
    `<rect width="${WIDTH}" height="150" fill="url(#serataWall)"/>${damask}` +
    `\n<g transform="translate(${WIDTH - 720} 0)">${window}</g>\n` +
    `<polyline points="${wire.join(' ')}" fill="none" stroke="#4a1a34" stroke-width="1.2"/>${garland}` +
    `<text x="16" y="17" font-family="Menlo, 'SF Mono', monospace" font-weight="700" font-size="11" letter-spacing="1.5" fill="#ffd6e4" filter="url(#neon)">M2V-MDO</text>` +
    `<rect x="44" y="26" width="51" height="46" fill="#2a0f1e" stroke="#6a2a4a" stroke-width="3"/>${pixelHeart}` +
    `<rect y="150" width="${WIDTH}" height="${HEIGHT - 150}" fill="url(#serataFloor)"/><rect y="150" width="${WIDTH}" height="2" fill="#7a2a4a"/>` +
    `<g pointer-events="none">${petals}</g>`
  )
}

// A crown of little flowers, in a Claude's own cells: a green band, three
// blossoms on it, rose, white and rose, each with a golden heart.
const CROWN =
  box(0, -0.25, 8, 0.25, '#4f9a4a') +
  [0.4, 3.4, 6.4]
    .map((x, i) => box(x, -1.15, 1.2, 1, i === 1 ? '#fff3f6' : '#ff6f91') + box(x + 0.4, -0.8, 0.4, 0.35, '#ffd166'))
    .join('')

export const SERATA: Ambience = {
  defs: DEFS,
  room,
  beams: ['serataBeamRose', 'serataBeamGold'],
  sign: { fill: '#ffe6ee', stroke: '#ff4f86' },
  crown: CROWN,
  instruments: 'band',
  // The riser in the wine of the walls.
  riser: { fill: '#3a1426', edge: '#7a2a4a' },
}
