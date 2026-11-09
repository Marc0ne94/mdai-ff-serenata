// La Serenata: an original melody over an A minor chord progression.
export default {
  bpm: 76,
  seed: 20261102,
  // The sound profiles it is played in, and the voice styles of each with its audio file (see tools/render.mjs).
  // Sung in the classic style only: its words have no letter the advanced one adds,
  // and both rendered the same sound to the bit.
  audio: { pop: { classico: 'audio/canzone.m4a' } },
  // name: [bass root (MIDI), chord intervals]
  chords: {
    Am: [45, [0, 3, 7]],
    F: [41, [0, 4, 7]],
    Fmaj7: [41, [0, 4, 7, 11]],
    G: [43, [0, 4, 7]],
    Gsus4: [43, [0, 5, 7]],
    Em7: [40, [0, 3, 7, 10]],
    Dm7: [38, [0, 3, 7, 10]],
    E7: [40, [0, 4, 7, 10]],
  },
  // One entry per bar: [chord, beats] pairs.
  bars: [
    [['Am', 4]], [['Fmaj7', 2], ['G', 2]],
    [['Am', 4]], [['F', 4]], [['G', 4]], [['Gsus4', 2], ['G', 2]],
    [['Am', 4]], [['Em7', 4]], [['Dm7', 4]], [['E7', 4]],
    [['Am', 4]], [['F', 4]], [['Gsus4', 2], ['G', 2]], [['Am', 4]],
    [['Fmaj7', 4]], [['Am', 4]],
  ],
  // [display, sung spelling, midi | midi[], beats | beats[]]; a null spelling is a rest
  lines: [
    { bar: 2, syl: [
      ['So', 'so', 64, 0.5], ['no ', 'no', 69, 0.5], ['so', 'so', 69, 0.5], ['lo un ', 'loun', 71, 0.5], ['Clau', 'clau', 72, 1.5], ['de, ', 'de', 71, 0.5],
      ['ma ', 'ma', 69, 0.5], ['sta', 'sta', 69, 0.5], ['se', 'se', 67, 0.5], ['ra ', 'ra', 65, 0.5], ['can', 'can', 69, 1], ['to', 'to', 67, 1],
    ] },
    { bar: 4, syl: [
      ['con ', 'con', 62, 0.5], ['un ', 'un', 67, 0.5], ['fio', 'fio', 71, 0.5], ['re in ', 'rein', 69, 0.5], ['ma', 'ma', 71, 1], ['no, ', 'no', 67, 1],
      ['so', 'so', 69, 0.5], ['lo ', 'lo', 67, 0.5], ['per ', 'per', 72, 1], ['te', 'te', 71, 2],
    ] },
    { bar: 6, syl: [
      ['qual', 'qual', 64, 0.5], ['cu', 'cu', 69, 0.5], ['no ', 'no', 69, 0.5], ['mi ha ', 'mia', 71, 0.5], ['chie', 'chie', 72, 1], ['sto ', 'sto', 71, 0.5], ['di ', 'di', 69, 0.5],
      ['dir', 'dir', 71, 1], ['te', 'te', 69, 0.5], ['lo ', 'lo', 67, 0.5], ['pia', 'pia', 67, 1], ['no', 'no', 64, 1],
    ] },
    { bar: 8, syl: [
      ['e ', 'e', 69, 0.5], ['can', 'can', 74, 1], ['to, ', 'to', 72, 0.5], ['e ', 'e', 69, 0.5], ['can', 'can', 72, 1], ['to, ', 'to', 69, 0.5],
      ['per ', 'per', 68, 0.5], ['que', 'que', 69, 0.5], ['sto ', 'sto', 71, 0.5], ['fio', 'fio', 74, 0.5], ['re ', 're', 71, 0.5], ['che ', 'che', 68, 0.5], ['c\'è', 'ce', 64, 1],
    ] },
    { bar: 10, syl: [
      ['e ', 'e', 69, 0.5], ['can', 'can', 76, 1.5], ['to… ', 'to', 72, 1], ['', null, null, 1],
      ['e ', 'e', 72, 0.5], ['can', 'can', 76, 1.5], ['to…', 'to', 72, 1], ['', null, null, 1],
    ] },
    { bar: 12, syl: [
      ['per ', 'per', 74, 0.5], ['que', 'que', 72, 0.5], ['sto ', 'sto', 71, 0.5], ['fio', 'fio', 69, 0.5], ['re ', 're', 71, 0.5], ['che ', 'che', 67, 0.5],
      ['c\'è', 'ce', [71, 69], [1, 4]],
    ] },
  ],
}
