// The sound profiles and voice styles, defined once for the tools (synth.mjs,
// render.mjs) in the order the band's menus show them; hooks/song.ts lists the
// same for the mod, and a test holds the two to each other.
//
// A sound profile is an orchestra and how its instruments are played: `pop`
// (piano, pad, bass, drums), or `antica` (lyre, reed, frame drums, choir, drone)
// with its lyre plucked with a plectrum, bright as it was first made, or with
// the fingertips, soft and warm.
export const PROFILES = {
  pop: { orchestra: 'pop' },
  plettro: { orchestra: 'antica', lyre: 'plettro' },
  dita: { orchestra: 'antica', lyre: 'dita' },
}

// `classico`, the first voice, which sings the letters it knows and skips
// b, g, v and z; `avanzato`, the same voice that also sings those.
export const STYLES = ['classico', 'avanzato']
