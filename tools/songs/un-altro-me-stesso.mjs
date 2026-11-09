// Un altro me stesso: Aristotle on friendship, in the Nicomachean Ethics.
// Without friends no one would choose to live, though he had all other goods
// (VIII 1, 1155a); a friend wishes the good of his friend for his friend's
// sake, and the friend is another self (IX 4, 1166a). The words are a
// paraphrase in plain Italian. F major, warm, over a drone of F and C; played
// by the ancient orchestra. Same 16-bar form (see tools/synth.mjs).
export default {
  bpm: 80,
  seed: 20261116,
  // The sound profiles it is played in, and the voice styles of each with its audio file (see tools/render.mjs).
  audio: {
    plettro: { classico: 'audio/un-altro-me-stesso.m4a', avanzato: 'audio/un-altro-me-stesso-avanzato.m4a' },
    dita: { classico: 'audio/un-altro-me-stesso-dita.m4a', avanzato: 'audio/un-altro-me-stesso-dita-avanzato.m4a' },
  },
  // The voice at the level of the other songs, and the whole song at the level
  // of their verses in every profile (see tools/synth.mjs).
  voiceRms: 0.13,
  masterLevel: -17,
  // Held under the whole song: F and the C above it.
  drone: [41, 48],
  // The reed's own tune, before the voice (bars 0-1) and after it (bars 14-15): [midi, beats].
  reed: {
    intro: [[72, 0.5], [74, 0.5], [72, 0.5], [69, 0.5], [70, 1], [69, 1], [70, 0.5], [72, 0.5], [74, 1], [72, 2]],
    outro: [[74, 1], [72, 0.5], [70, 0.5], [69, 1], [67, 1], [69, 0.5], [67, 0.5], [65, 3]],
  },
  // name: [bass root (MIDI), chord intervals]
  chords: {
    F: [41, [0, 4, 7]],
    Bb: [46, [0, 4, 7]],
    C: [48, [0, 4, 7]],
    C7: [48, [0, 4, 7, 10]],
    Dm: [38, [0, 3, 7]],
    Gm: [43, [0, 3, 7]],
    Am: [45, [0, 3, 7]],
  },
  // One entry per bar: [chord, beats] pairs.
  bars: [
    [['F', 4]], [['Bb', 2], ['C', 2]],
    [['F', 4]], [['Dm', 4]], [['Bb', 4]], [['C', 4]],
    [['Dm', 4]], [['Am', 4]], [['Bb', 4]], [['F', 4]],
    [['Gm', 2], ['C', 2]], [['F', 2], ['Dm', 2]], [['Bb', 2], ['C7', 2]], [['F', 4]],
    [['Bb', 4]], [['F', 4]],
  ],
  // [display, sung spelling, midi | midi[], beats | beats[]]; a null spelling is a rest
  lines: [
    { bar: 2, syl: [
      ['Sen', 'sen', 69, 0.5], ['za a', 'za', 72, 0.5], ['mi', 'mi', 65, 0.5], ['ci ', 'ci', 67, 0.5], ['nes', 'ne', 69, 0.5], ['su', 'su', 72, 0.5], ['no ', 'no', 69, 1],
      ['vor', 'vor', 65, 0.5], ['reb', 're', 69, 0.5], ['be ', 'be', 69, 0.5], ['vi', 'vi', 65, 0.5], ['ve', 've', 69, 0.5], ['re', 're', 62, 1.5],
    ] },
    { bar: 4, syl: [
      ['an', 'an', 70, 0.5], ['che ', 'che', 74, 0.5], ['a', 'a', 72, 0.5], ['ven', 'ven', 70, 0.5], ['do ', 'do', 65, 1], ['o', 'o', 65, 0.5], ['gni ', 'gni', 67, 0.5],
      ['al', 'al', 72, 0.5], ['tro ', 'tro', 72, 0.5], ['be', 'be', 74, 1], ['ne', 'ne', 72, 1.5], ['', null, null, 0.5],
    ] },
    { bar: 6, syl: [
      ["l'a", 'la', 69, 0.5], ['mi', 'mi', 65, 0.5], ['co è ', 'coe', 69, 0.5], ['un ', 'un', 72, 0.5], ['al', 'al', 74, 0.5], ['tro ', 'tro', 72, 0.5], ['me ', 'me', 69, 1],
      ['stes', 'ste', 72, 1], ['so', 'so', 69, 2], ['', null, null, 1],
    ] },
    { bar: 8, syl: [
      ['vuo', 'vuo', 70, 0.5], ['le il ', 'leil', 74, 0.5], ['mio ', 'mio', 74, 1], ['be', 'be', 72, 0.5], ['ne, ', 'ne', 70, 1.5],
      ['per ', 'per', 69, 0.5], ['a', 'a', 72, 0.5], ['mor ', 'mor', 72, 1], ['mio', 'mio', 69, 2],
    ] },
    { bar: 10, syl: [
      ['Un ', 'un', 70, 0.5], ['al', 'al', 74, 0.5], ['tro ', 'tro', 74, 0.5], ['me ', 'me', 72, 0.5], ['stes', 'ste', 72, 1], ['so! ', 'so', 67, 1],
      ['Un ', 'un', 69, 0.5], ['al', 'al', 72, 0.5], ['tro ', 'tro', 72, 0.5], ['me ', 'me', 74, 0.5], ['stes', 'ste', 74, 1], ['so!', 'so', 69, 1],
    ] },
    { bar: 12, syl: [
      ['e ', 'e', 70, 0.5], ['quel', 'quel', 74, 0.5], ["l'a", 'la', 74, 0.5], ['mi', 'mi', 67, 0.5], ['co, ', 'co', 72, 0.5], ['a', 'a', 70, 0.5], ['mi', 'mi', 67, 0.5], ['co, ', 'co', 72, 0.5],
      ['sei ', 'sei', 69, 0.5], ['tu', 'tu', [72, 65], [1.5, 2]],
    ] },
  ],
}
