// Tutto pronto: Claude has finished the work and sings it, in C major, brighter
// and quicker than the Serenata. Same 16-bar form (see tools/synth.mjs).
export default {
  bpm: 92,
  seed: 20261108,
  // The sound profiles it is played in, and the voice styles of each with its audio file (see tools/render.mjs).
  // Sung in the classic style only: its words have no letter the advanced one adds,
  // and both rendered the same sound to the bit.
  audio: { pop: { classico: 'audio/tutto-pronto.m4a' } },
  // name: [bass root (MIDI), chord intervals]
  chords: {
    C: [48, [0, 4, 7]],
    F: [41, [0, 4, 7]],
    Fmaj7: [41, [0, 4, 7, 11]],
    G: [43, [0, 4, 7]],
    G7: [43, [0, 4, 7, 10]],
    Am: [45, [0, 3, 7]],
    Em7: [40, [0, 3, 7, 10]],
  },
  // One entry per bar: [chord, beats] pairs.
  bars: [
    [['C', 4]], [['F', 2], ['G', 2]],
    [['C', 4]], [['Am', 4]], [['F', 4]], [['G', 4]],
    [['Am', 4]], [['Em7', 4]], [['F', 4]], [['G7', 4]],
    [['C', 4]], [['Am', 4]], [['F', 2], ['G', 2]], [['C', 4]],
    [['Fmaj7', 4]], [['C', 4]],
  ],
  // [display, sung spelling, midi | midi[], beats | beats[]]; a null spelling is a rest
  lines: [
    { bar: 2, syl: [
      ['Tut', 'tu', 67, 0.5], ['to è ', 'toe', 67, 0.5], ['pron', 'pron', 72, 1], ['to, ', 'to', 67, 1], ['tut', 'tu', 64, 0.5], ['to è ', 'toe', 67, 0.5],
      ['fat', 'fa', 72, 1], ['to', 'to', 69, 2], ['', null, null, 1],
    ] },
    { bar: 4, syl: [
      ['e il ', 'eil', 65, 0.5], ['co', 'co', 69, 0.5], ['di', 'di', 72, 0.5], ['ce è ', 'ce', 72, 0.5], ['pu', 'pu', 72, 0.5], ['li', 'li', 74, 1.5],
      ['to', 'to', 71, 3], ['', null, null, 1],
    ] },
    { bar: 6, syl: [
      ['o', 'o', 69, 0.5], ['ra ', 'ra', 72, 0.5], ['ri', 'ri', 67, 0.5], ['po', 'po', 72, 1], ['sa, ', 'sa', 69, 1], ['a', 'a', 69, 0.5],
      ['mi', 'mi', 71, 0.5], ['co ', 'co', 67, 0.5], ['mio', 'mio', [67, 64], [1, 1]], ['', null, null, 1],
    ] },
    { bar: 8, syl: [
      ['e ', 'e', 69, 0.5], ['can', 'can', 72, 1], ['to, ', 'to', 69, 0.5], ['e ', 'e', 69, 0.5], ['can', 'can', 72, 1], ['to, ', 'to', 69, 0.5],
      ['per ', 'per', 71, 0.5], ['te ', 'te', 74, 0.5], ['che ', 'che', 74, 0.5], ['ci ', 'ci', 67, 0.5], ['sei', 'sei', [71, 74], [1, 1]],
    ] },
    { bar: 10, syl: [
      ['Tut', 'tu', 72, 0.5], ['to è ', 'toe', 76, 0.5], ['fat', 'fa', 76, 1], ['to! ', 'to', 74, 1], ['', null, null, 1],
      ['tut', 'tu', 72, 0.5], ['to è ', 'toe', 76, 0.5], ['pron', 'pron', 76, 1], ['to!', 'to', 72, 1], ['', null, null, 1],
    ] },
    { bar: 12, syl: [
      ['e ', 'e', 72, 0.5], ['a', 'a', 72, 0.5], ['des', 'de', 74, 0.5], ['so ', 'so', 72, 0.5], ['can', 'can', 71, 1], ['to ', 'to', 67, 1],
      ['per ', 'per', 69, 0.5], ['te', 'te', [71, 72], [0.5, 3]],
    ] },
  ],
}
