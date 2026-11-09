import type { Scenery } from '../draw'
import { n1, random, sec } from '../draw'
import type { Song } from '../song'

// The scenery of the voyage home: the Aegean at sunset in the window, where a
// ship sails to its island while the sun goes down and night comes; a bronze
// brazier beside the singer whose fire grows with the song; a lyre for the
// singer's hand.

const DEFS = `<defs>
<clipPath id="tempioWindow"><rect x="610" y="20" width="88" height="78"/></clipPath>
<linearGradient id="tempioSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2a6b"/><stop offset="0.65" stop-color="#c8607a"/><stop offset="1" stop-color="#f6a35c"/></linearGradient>
<linearGradient id="tempioSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c5a8c"/><stop offset="1" stop-color="#14284a"/></linearGradient>
<radialGradient id="tempioSun"><stop offset="0" stop-color="#fff1b8" stop-opacity="0.9"/><stop offset="1" stop-color="#ffb35c" stop-opacity="0"/></radialGradient>
<radialGradient id="tempioGlow"><stop offset="0" stop-color="#ff9a3c" stop-opacity="0.85"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>
<linearGradient id="tempioBronze" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a4a1e"/><stop offset="0.5" stop-color="#c88a3c"/><stop offset="1" stop-color="#6b3f18"/></linearGradient>
</defs>`

// ---------- the sea in the window ----------

const HORIZON = 74
const ISLAND_X = 684

function sea(song: Song) {
  const night = song.outroAt
  // The sun sinks through the whole song and is gone below the sea at the close.
  const sun =
    `<g><animateTransform attributeName="transform" type="translate" from="0 0" to="0 ${HORIZON - 36 + 12}" begin="0s" dur="${sec(night)}" fill="freeze"/>` +
    `<circle cx="652" cy="36" r="16" fill="url(#tempioSun)"/><circle cx="652" cy="36" r="7" fill="#ffd27a"/></g>`
  // The sea, with its glints moving.
  let glints = ''
  for (let i = 0; i < 6; i++) {
    const y = HORIZON + 4 + i * 3.5
    glints += `<rect x="${n1(614 + ((i * 23) % 70))}" y="${n1(y)}" width="${8 + (i % 3) * 3}" height="0.8" fill="#ffd9a0" opacity="0.5"><animate attributeName="x" values="${n1(614 + ((i * 23) % 70))};${n1(620 + ((i * 23) % 70))};${n1(614 + ((i * 23) % 70))}" dur="${n1(3 + i * 0.4)}s" repeatCount="indefinite"/></rect>`
  }
  const island =
    `<path d="M ${ISLAND_X - 14} ${HORIZON} Q ${ISLAND_X - 4} ${HORIZON - 12} ${ISLAND_X + 4} ${HORIZON - 9} Q ${ISLAND_X + 10} ${HORIZON - 7} ${ISLAND_X + 16} ${HORIZON} Z" fill="#2b1f3a"/>` +
    `<rect x="${ISLAND_X - 3}" y="${HORIZON - 14}" width="8" height="1.2" fill="#e8dcc8"/>` +
    [ISLAND_X - 2.5, ISLAND_X, ISLAND_X + 2.5].map(x => `<rect x="${n1(x)}" y="${HORIZON - 12.8}" width="0.9" height="3" fill="#e8dcc8"/>`).join('')
  // The ship sails from the left to the island, which it reaches at the finale.
  const ship =
    `<g transform="translate(618 ${HORIZON - 1})"><g>` +
    `<animateTransform attributeName="transform" type="translate" from="0 0" to="${ISLAND_X - 24 - 618} 0" begin="0.5s" dur="${sec(song.finaleAt - 0.5)}" fill="freeze"/>` +
    `<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -0.8;0 0" dur="1.6s" repeatCount="indefinite"/>` +
    `<path d="M -7 -2 L 7 -2 L 5 1.5 L -5 1.5 Z" fill="#5a3418"/>` +
    `<line x1="0" y1="-2" x2="0" y2="-12" stroke="#3a2412" stroke-width="0.8"/>` +
    `<path d="M -5 -11 L 5 -11 L 4.5 -4 L -4.5 -4 Z" fill="#f4ecdc"/><rect x="-4.8" y="-8.2" width="9.6" height="1.4" fill="#b8323c"/>` +
    `</g></g></g>`
  // Night: the sky darkens through the finale, then stars and a crescent moon.
  const r = random(53)
  let stars = ''
  for (let i = 0; i < 10; i++) {
    stars += `<circle cx="${n1(613 + r() * 82)}" cy="${n1(23 + r() * 44)}" r="${n1(0.5 + r() * 0.5)}" fill="#fff" opacity="0"><animate attributeName="opacity" values="0;1;0.3;1" dur="${n1(2 + r() * 2)}s" begin="${sec(night + r() * 2)}" fill="freeze"/></circle>`
  }
  const dusk =
    `<rect x="610" y="20" width="88" height="78" fill="#0b1030" opacity="0">` +
    `<animate attributeName="opacity" from="0" to="0.78" begin="${sec(song.finaleAt)}" dur="${sec(night + 1.5 - song.finaleAt)}" fill="freeze"/></rect>`
  const moon =
    `<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${sec(night + 1)}" dur="2s" fill="freeze"/>` +
    `<circle cx="630" cy="34" r="6" fill="#fdf3c4"/><circle cx="632.6" cy="32.6" r="5.4" fill="#18183a"/></g>`
  return (
    `<rect x="606" y="16" width="96" height="86" fill="#3a2a55"/>` +
    `<g clip-path="url(#tempioWindow)">` +
    `<rect x="610" y="20" width="88" height="${HORIZON - 20}" fill="url(#tempioSky)"/>${sun}` +
    `<rect x="610" y="${HORIZON}" width="88" height="${98 - HORIZON}" fill="url(#tempioSea)"/>${glints}${island}${ship}${dusk}${stars}${moon}` +
    `</g>`
  )
}

// ---------- the brazier beside the singer ----------

// A flame: a tongue of fire that flickers on its own beat.
const flame = (x: number, h: number, w: number, fill: string, dur: number) =>
  `<g transform="translate(${x} 0)"><g>` +
  `<animateTransform attributeName="transform" type="scale" values="1 1;1.08 0.9;0.94 1.1;1 1" dur="${dur}s" repeatCount="indefinite"/>` +
  `<path d="M 0 0 C ${-w} ${-h * 0.3} ${-w * 0.4} ${-h * 0.7} 0 ${-h} C ${w * 0.4} ${-h * 0.7} ${w} ${-h * 0.3} 0 0 Z" fill="${fill}"/></g></g>`

function brazier(song: Song) {
  const bowlY = 420
  // The fire grows line by line: small at first, high at the bloom, highest in the finale.
  const steps: [number, number][] = [[0, 0.35], [song.lines[1]?.start ?? 0, 0.55], [song.lines[2]?.start ?? 0, 0.7], [song.bloomAt, 1], [song.finaleAt, 1.25]]
  const grow = steps
    .slice(1)
    .map(([t, size], i) => `<animateTransform attributeName="transform" type="scale" from="${steps[i]?.[1] ?? 1}" to="${size}" begin="${sec(t)}" dur="1s" fill="freeze"/>`)
    .join('')
  const fire =
    `<g transform="translate(300 ${bowlY - 4})"><g transform="scale(${steps[0]?.[1] ?? 1})">${grow}` +
    flame(-26, 70, 18, '#ff7b39', 0.7) + flame(24, 76, 18, '#ff7b39', 0.8) + flame(0, 110, 26, '#ff9a3c', 0.9) +
    flame(-12, 70, 14, '#ffd166', 0.6) + flame(12, 74, 14, '#ffd166', 0.65) + flame(0, 52, 10, '#fff3c4', 0.5) +
    `</g></g>`
  const glow =
    `<circle cx="300" cy="${bowlY - 50}" r="130" fill="url(#tempioGlow)" opacity="0.25">` +
    `<animate attributeName="opacity" to="0.5" begin="${sec(song.bloomAt)}" dur="1.5s" fill="freeze"/>` +
    `<animate attributeName="opacity" values="0.5;0.8;0.5" dur="${sec(2 * song.beat)}" begin="${sec(song.finaleAt)}" end="${sec(song.outroAt + 2)}" repeatCount="indefinite"/></circle>`
  const legs =
    `<ellipse cx="300" cy="545" rx="95" ry="6" fill="#000" opacity="0.3"/>` +
    `<line x1="252" y1="${bowlY + 16}" x2="226" y2="545" stroke="url(#tempioBronze)" stroke-width="9" stroke-linecap="round"/>` +
    `<line x1="348" y1="${bowlY + 16}" x2="374" y2="545" stroke="url(#tempioBronze)" stroke-width="9" stroke-linecap="round"/>` +
    `<line x1="300" y1="${bowlY + 20}" x2="300" y2="540" stroke="#6b3f18" stroke-width="8" stroke-linecap="round"/>` +
    `<rect x="244" y="490" width="112" height="7" rx="3" fill="#8a5a2b"/>`
  const bowl =
    `<path d="M 236 ${bowlY - 6} L 364 ${bowlY - 6} Q 356 ${bowlY + 26} 300 ${bowlY + 28} Q 244 ${bowlY + 26} 236 ${bowlY - 6} Z" fill="url(#tempioBronze)"/>` +
    `<rect x="230" y="${bowlY - 12}" width="140" height="8" rx="3" fill="#c88a3c"/>` +
    // A meander, the Greek key, along the bowl.
    `<path d="M 246 ${bowlY + 4} h 8 v -6 h -4 v 3 h 8 v 3 h 8 v -6 h -4 v 3 h 8 v 3 h 8 v -6 h -4 v 3 h 8 v 3 h 8 v -6 h -4 v 3 h 8 v 3 h 8 v -6 h -4 v 3 h 8 v 3 h 8 v -6 h -4 v 3 h 8 v 3 h 8" stroke="#5a3418" stroke-width="1.6" fill="none"/>`
  // Embers rising from the fire through the finale, gone before the close.
  const r = random(61)
  let embers = ''
  for (let i = 0; i < 12; i++) {
    const begin = [0, 1, 2]
      .map(k => song.finaleAt + i * 0.45 + k * 4.2)
      .filter(t => t + 3 <= song.outroAt + 1)
      .map(sec)
      .join(';')
    if (!begin) continue
    const dx = Math.round((r() - 0.5) * 120)
    embers +=
      `<g transform="translate(${n1(300 + (r() - 0.5) * 60)} ${bowlY - 30})"><circle r="${n1(2.5 + r() * 2)}" fill="${i % 2 ? '#ffd166' : '#ff7b39'}" opacity="0">` +
      `<animateTransform attributeName="transform" type="translate" values="0 0;${dx / 2} -110;${dx} -220" dur="3s" begin="${begin}"/>` +
      `<animate attributeName="opacity" values="0;1;0.8;0" keyTimes="0;0.1;0.6;1" dur="3s" begin="${begin}"/></circle></g>`
  }
  return `${glow}${legs}${fire}${bowl}${embers}`
}

// ---------- the lyre for the singer's hand ----------

const LYRE = [
  'G.......G',
  '.G.....G.',
  '.GGGGGGG.',
  '.G.S.S.G.',
  '.G.S.S.G.',
  '.G.S.S.G.',
  '.G.S.S.G.',
  '..GS.SG..',
  '..GS.SG..',
  '..GS.SG..',
  '..DDDDD..',
  '..DDDDD..',
  '...DDD...',
  '.........',
  '.........',
]
const LYRE_COLORS: Record<string, string> = { G: '#d4a24c', D: '#8a5a2b', S: '#f4f1ea' }

export const TEMPIO: Scenery = {
  neon: ['ODISSEA', 'PER TE ♥'],
  defs: DEFS,
  wall: sea,
  prop: brazier,
  gadget: { pixels: LYRE, colors: LYRE_COLORS },
}
