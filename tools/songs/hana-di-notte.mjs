// HANA di notte: the night when the in-memory database keeps working while the
// world sleeps, and at dawn the report is ready. Sung legato: a double
// consonant goes to the next syllable (no-tte, tu-tto), as Italian is sung.
// E minor, at night, opening onto G major at dawn; played by the band.
// Same 16-bar form (see tools/synth.mjs).
export default {
  bpm: 84,
  seed: 20261114,
  // The sound profiles it is played in, and the voice styles of each with its audio file (see tools/render.mjs).
  audio: { pop: { classico: 'audio/hana-di-notte.m4a', avanzato: 'audio/hana-di-notte-avanzato.m4a' } },
  // The voice at the level of the other songs in both styles, and the whole song
  // at the level of their verses (see tools/synth.mjs).
  voiceRms: 0.13,
  masterLevel: -17,
  // name: [bass root (MIDI), chord intervals]
  chords: {
    Em: [40, [0, 3, 7]],
    C: [48, [0, 4, 7]],
    Cmaj7: [48, [0, 4, 7, 11]],
    G: [43, [0, 4, 7]],
    D: [38, [0, 4, 7]],
    Am: [45, [0, 3, 7]],
    B7: [47, [0, 4, 7, 10]],
  },
  // One entry per bar: [chord, beats] pairs.
  bars: [
    [['Em', 4]], [['C', 2], ['D', 2]],
    [['Em', 4]], [['C', 4]], [['G', 4]], [['D', 4]],
    [['Am', 4]], [['B7', 4]], [['Em', 4]], [['C', 4]],
    [['G', 2], ['D', 2]], [['Em', 2], ['C', 2]], [['Am', 2], ['B7', 2]], [['Em', 4]],
    [['Cmaj7', 4]], [['G', 4]],
  ],
  // [display, sung spelling, midi | midi[], beats | beats[]]; a null spelling is a rest
  lines: [
    { bar: 2, syl: [
      ['HA', 'a', 71, 1], ['NA ', 'na', 71, 1], ['di ', 'di', 67, 0.5], ['not', 'no', 71, 0.5], ['te, ', 'te', 69, 1],
      ['la ', 'la', 67, 0.5], ['me', 'me', 67, 0.5], ['mo', 'mo', 72, 0.5], ['ria è ', 'riae', 71, 0.5], ['ac', 'a', 69, 0.5], ['ce', 'ce', 67, 0.5], ['sa', 'sa', 64, 1],
    ] },
    { bar: 4, syl: [
      ['i ', 'i', 67, 0.5], ['da', 'da', 71, 0.5], ['ti ', 'ti', 67, 0.5], ['vo', 'vo', 74, 1], ['la', 'la', 71, 0.5], ['no, ', 'no', 71, 1],
      ['leg', 'le', 69, 0.5], ['ge', 'ge', 71, 1], ['ri', 'ri', 66, 1.5], ['', null, null, 1],
    ] },
    { bar: 6, syl: [
      ['il ', 'il', 64, 0.5], ['mon', 'mon', 69, 1], ['do ', 'do', 72, 0.5], ['dor', 'dor', 71, 1], ['me, ', 'me', 69, 1],
      ['lei ', 'lei', 71, 1], ['la', 'la', 69, 0.5], ['vo', 'vo', 71, 0.5], ['ra', 'ra', 66, 1], ['', null, null, 1],
    ] },
    { bar: 8, syl: [
      ['e ', 'e', 71, 0.5], ['can', 'can', 76, 1], ['to, ', 'to', 74, 0.5], ['e ', 'e', 71, 0.5], ['can', 'can', 76, 1], ['to, ', 'to', 74, 0.5],
      ['men', 'men', 72, 0.5], ['tre il ', 'treil', 72, 0.5], ['si', 'si', 67, 0.5], ['ste', 'ste', 72, 0.5], ['ma ', 'ma', 71, 0.5], ['va', 'va', 67, 1.5],
    ] },
    { bar: 10, syl: [
      ['Tut', 'tu', 74, 0.5], ['to in ', 'toin', 74, 0.5], ['me', 'me', 76, 0.5], ['mo', 'mo', 74, 0.5], ['ri', 'ri', 66, 0.5], ['a… ', 'a', 69, 1.5],
      ['tut', 'tu', 71, 0.5], ['to in ', 'toin', 71, 0.5], ['me', 'me', 72, 0.5], ['mo', 'mo', 71, 0.5], ['ri', 'ri', 64, 0.5], ['a…', 'a', 67, 1.5],
    ] },
    { bar: 12, syl: [
      ['e ', 'e', 69, 0.5], ['al', 'al', 72, 0.5], ["l'alba ", 'ba', 71, 1], ['il ', 'il', 66, 0.5], ['re', 're', 71, 0.5], ['port ', 'por', 69, 0.5], ['per ', 'per', 71, 0.5],
      ['te', 'te', [67, 64], [1.5, 2.5]],
    ] },
  ],
}
