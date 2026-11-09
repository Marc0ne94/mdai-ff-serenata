// Odissea: sailing home across the wine-dark sea, past islands, stars and
// sirens, to Ithaca. An homage to Homer: the wine-dark sea is his epithet, and
// the fourth line calls the Muse as the Odyssey opens (Odyssey I, 1).
// D dorian (a minor scale with a bright sixth, B natural), over a drone of D
// and A; played by the ancient orchestra (lyre, reed, frame drums, choir), its
// lyre with a plectrum or with the fingertips. An original tune in that old
// spirit. Same 16-bar form (see tools/synth.mjs).
export default {
  bpm: 72,
  seed: 20261112,
  // The sound profiles it is played in, and the voice styles of each with its audio file (see tools/render.mjs).
  audio: {
    plettro: { classico: 'audio/odissea.m4a', avanzato: 'audio/odissea-avanzato.m4a' },
    dita: { classico: 'audio/odissea-dita.m4a', avanzato: 'audio/odissea-dita-avanzato.m4a' },
  },
  // The voice at the level of the other songs, in both styles (see tools/synth.mjs).
  voiceRms: 0.13,
  // The whole song at a set level in every profile (see tools/synth.mjs): the
  // level the plectrum version first had, so the fingertips one matches it.
  masterLevel: -16.1,
  // Held under the whole song: D and the A above it.
  drone: [38, 45],
  // The reed's own tune, before the voice (bars 0-1) and after it (bars 14-15): [midi, beats].
  reed: {
    intro: [[62, 0.5], [65, 0.5], [69, 1], [71, 0.5], [69, 0.5], [67, 1], [65, 1], [64, 0.5], [62, 0.5], [62, 2]],
    outro: [[74, 1], [72, 0.5], [71, 0.5], [69, 1], [67, 1], [65, 1], [64, 0.5], [65, 0.5], [62, 2]],
  },
  // name: [bass root (MIDI), chord intervals]
  chords: {
    Dm: [38, [0, 3, 7]],
    C: [48, [0, 4, 7]],
    G: [43, [0, 4, 7]],
    F: [41, [0, 4, 7]],
    Am: [45, [0, 3, 7]],
  },
  // One entry per bar: [chord, beats] pairs.
  bars: [
    [['Dm', 4]], [['Dm', 4]],
    [['Dm', 4]], [['C', 4]], [['Dm', 4]], [['G', 4]],
    [['F', 4]], [['C', 4]], [['Dm', 4]], [['Am', 4]],
    [['Dm', 2], ['C', 2]], [['G', 2], ['Am', 2]], [['F', 4]], [['Dm', 4]],
    [['C', 4]], [['Dm', 4]],
  ],
  // [display, sung spelling, midi | midi[], beats | beats[]]; a null spelling is a rest
  lines: [
    { bar: 2, syl: [
      ['Sul ', 'sul', 62, 0.5], ['ma', 'ma', 65, 0.5], ['re ', 're', 69, 1], ['co', 'co', 67, 0.5], ['lor ', 'lor', 65, 0.5], ['del ', 'del', 64, 1],
      ['vi', 'vi', 64, 1], ['no', 'no', 67, 2], ['', null, null, 1],
    ] },
    { bar: 4, syl: [
      ['il ', 'il', 62, 0.5], ['ven', 'ven', 65, 0.5], ['to ', 'to', 69, 1], ['mi ', 'mi', 65, 0.5], ['por', 'por', 69, 0.5], ['ta ', 'ta', 71, 0.5], ['a ', 'a', 69, 0.5],
      ['te', 'te', [71, 67], [2, 1]], ['', null, null, 1],
    ] },
    { bar: 6, syl: [
      ['i', 'i', 65, 0.5], ['so', 'so', 69, 0.5], ['le, ', 'le', 72, 1], ['stel', 'stel', 72, 0.5], ['le ', 'le', 69, 0.5], ['e ', 'e', 65, 1],
      ['si', 'si', 64, 0.5], ['re', 're', 67, 0.5], ['ne', 'ne', 72, 2], ['', null, null, 1],
    ] },
    { bar: 8, syl: [
      ['Mu', 'mu', 74, 1], ['sa, ', 'sa', 72, 1], ['rac', 'ra', 69, 0.5], ['con', 'con', 72, 0.5], ['ta', 'ta', 74, 0.5], ['mi il ', 'mil', 69, 0.5],
      ['lun', 'lun', 72, 0.5], ['go ', 'go', 71, 0.5], ['ri', 'ri', 64, 0.5], ['tor', 'tor', 72, 1], ['no', 'no', 69, 1.5],
    ] },
    { bar: 10, syl: [
      ['I', 'i', 69, 0.5], ['ta', 'ta', 74, 1], ['ca! ', 'ca', 72, 0.5], ['I', 'i', 67, 0.5], ['ta', 'ta', 72, 1], ['ca! ', 'ca', 71, 0.5],
      ['È ', 'e', 71, 0.5], ['là!', 'la', [74, 76], [1.5, 1.5]], ['', null, null, 0.5],
    ] },
    { bar: 12, syl: [
      ['e ', 'e', 69, 0.5], ['tor', 'tor', 72, 1], ['no, ', 'no', 69, 0.5], ['can', 'can', 72, 0.5], ['tan', 'tan', 74, 0.5], ['do ', 'do', 72, 1],
      ['per ', 'per', 69, 0.5], ['te', 'te', [65, 62], [1.5, 2]],
    ] },
  ],
}
