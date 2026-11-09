// Fable 5.2: hardcore at 200 for the day a new Claude came out, told as a
// fable. Once upon a time a prompt in the night, asking for help, code and
// stories; then it came, faster than the wind: five point two. Every Claude
// on the dance floor, and the drop: «Fable! Fable! Cinque punto due!», jump,
// dance, shake that little tail. A second verse (it thinks deeper, answers on
// the fly, the code runs the first time), a breakdown where they all lived
// happily ever after, but the fable does not end there; the chorus again; a
// stop, the last chapter, and a last drop of eight bars a tone higher, where
// they lived dancing for ever.
// The verses in A minor, the drops in C major, the last in D major. Written
// at 100 and played in double time by the rave band (see tools/synth.mjs).
// Sung only in the advanced voice: its words need b, v and g (Fable, favola,
// gira).
export default {
  bpm: 100,
  doubleTime: true,
  seed: 20261115,
  audio: { rave: { avanzato: 'audio/fable.m4a' } },
  // The voice a little above the other songs, to ride over the kick, and the
  // whole song at their level (see tools/synth.mjs).
  voiceRms: 0.15,
  masterLevel: -17,
  // The kick from the first bar, the acid line with the first words, the hats
  // from the second line, stabs and claps from the third.
  build: { heartbeat: 0, bass: 2, drums: 4, pad: 6 },
  // The fable; every Claude on the floor (a two-bar break); the chorus; the
  // second verse; a breakdown; the chorus again; the last chapter (a two-bar
  // stop); the last drop, eight bars.
  form: [
    ['intro', 2], ['verse', 8], ['break', 2], ['drop', 4],
    ['verse', 4], ['break', 4], ['drop', 4], ['break', 2], ['drop', 8], ['outro', 2],
  ],
  // name: [bass root (MIDI), chord intervals]
  chords: {
    Am: [45, [0, 3, 7]],
    F: [41, [0, 4, 7]],
    C: [48, [0, 4, 7]],
    G: [43, [0, 4, 7]],
    Dm: [38, [0, 3, 7]],
    E7: [40, [0, 4, 7, 10]],
    G7: [43, [0, 4, 7, 10]],
    A7: [45, [0, 4, 7, 10]],
    D: [38, [0, 4, 7]],
    A: [45, [0, 4, 7]],
    Bm: [47, [0, 3, 7]],
  },
  // One entry per bar: [chord, beats] pairs.
  bars: [
    [['Am', 4]], [['F', 2], ['G', 2]],
    [['Am', 4]], [['F', 4]], [['C', 4]], [['G', 4]], [['Am', 4]], [['F', 4]], [['Dm', 4]], [['E7', 4]],
    [['F', 4]], [['G7', 4]],
    [['C', 4]], [['G', 4]], [['Am', 4]], [['F', 4]],
    [['Am', 4]], [['F', 4]], [['C', 4]], [['G', 4]],
    [['F', 4]], [['C', 4]], [['Dm', 4]], [['G7', 4]],
    [['C', 4]], [['G', 4]], [['Am', 4]], [['F', 4]],
    [['G', 4]], [['A7', 4]],
    [['D', 4]], [['A', 4]], [['Bm', 4]], [['G', 4]], [['D', 4]], [['A', 4]], [['Bm', 4]], [['G', 2], ['A', 2]],
    [['G', 2], ['A', 2]], [['D', 4]],
  ],
  // [display, sung spelling, midi | midi[], beats | beats[]]; a null spelling is a rest
  lines: [
    // The fable: once upon a time.
    { bar: 2, syl: [
      ["C'e", 'ce', 64, 0.5], ['ra ', 'ra', 64, 0.5], ['u', 'u', 67, 0.5], ['na ', 'na', 64, 0.5], ['vol', 'vol', 69, 1], ['ta ', 'ta', 67, 0.5], ['un ', 'un', 64, 0.5],
      ['prompt ', 'promt', 65, 1], ['nel', 'nel', 65, 0.5], ['la ', 'la', 64, 0.5], ['not', 'not', 60, 0.5], ['te… ', 'te', 62, 1], ['', null, null, 0.5],
    ] },
    { bar: 4, syl: [
      ['chie', 'kie', 64, 0.5], ['de', 'de', 64, 0.5], ['va ', 'va', 67, 0.5], ['a', 'a', 67, 0.5], ['iu', 'iu', 67, 0.5], ['to, ', 'to', 64, 1], ['', null, null, 0.5],
      ['co', 'co', 67, 0.5], ['di', 'di', 67, 0.5], ['ce ', 'ce', 71, 0.5], ['e ', 'e', 71, 0.5], ['sto', 'sto', 74, 0.5], ['rie… ', 'rie', 67, 1], ['', null, null, 0.5],
    ] },
    { bar: 6, syl: [
      ['poi ', 'poi', 64, 0.5], ['è ', 'e', 64, 0.5], ['ar', 'ar', 69, 0.5], ['ri', 'ri', 64, 0.5], ['va', 'va', 69, 0.5], ['to, ', 'to', 72, 1], ['', null, null, 0.5],
      ['più ', 'piu', 69, 0.5], ['ve', 've', 72, 0.5], ['lo', 'lo', 69, 0.5], ['ce ', 'ce', 69, 0.5], ['del ', 'del', 65, 0.5], ['ven', 'ven', 69, 0.5], ['to: ', 'to', 72, 1],
    ] },
    { bar: 8, syl: [
      ['cin', 'cin', 65, 0.5], ['que ', 'kue', 65, 0.5], ['pun', 'pun', 69, 0.5], ['to ', 'to', 69, 0.5], ['du', 'du', 74, 0.5], ['e… ', 'e', 74, 1], ['', null, null, 0.5],
      ['è ', 'e', 71, 1], ['qui!', 'kui', 68, 2], ['', null, null, 1],
    ] },
    // Every Claude on the floor: the kick out, a roll.
    { bar: 10, syl: [
      ['Tut', 'tut', 65, 0.5], ['ti i ', 'ti', 65, 0.5], ['Claude… ', 'clod', 69, 1.5], ['', null, null, 0.5], ['in ', 'in', 67, 0.5], ['pi', 'pi', 67, 0.5],
      ['sta… ', 'sta', 71, 1], ['a', 'a', 71, 0.5], ['des', 'des', 74, 0.5], ['so!', 'so', [74, 77], [1, 1]],
    ] },
    // The chorus.
    { bar: 12, syl: [
      ['Fa', 'fei', 76, 0.5], ['ble! ', 'bol', 72, 1], ['Fa', 'fei', 76, 0.5], ['ble! ', 'bol', 72, 1], ['Cin', 'cin', 67, 0.5], ['que ', 'kue', 67, 0.5],
      ['pun', 'pun', 71, 0.5], ['to ', 'to', 71, 0.5], ['du', 'du', 74, 1], ['e!', 'e', 74, 1.5], ['', null, null, 0.5],
    ] },
    { bar: 14, syl: [
      ['Sal', 'sal', 76, 0.5], ['ta, ', 'ta', 72, 1], ['bal', 'bal', 76, 0.5], ['la, ', 'la', 72, 1], ['muo', 'muo', 69, 0.5], ['vi il ', 'vi', 64, 0.5],
      ['cu', 'cu', 69, 0.5], ['let', 'let', 72, 0.5], ['to!', 'to', [77, 72], [1.5, 1]], ['', null, null, 0.5],
    ] },
    // The second verse.
    { bar: 16, syl: [
      ['Pen', 'pen', 64, 0.5], ['sa ', 'sa', 64, 0.5], ['più a ', 'piu', 67, 0.5], ['fon', 'fon', 69, 0.5], ['do, ', 'do', 67, 1.5], ['', null, null, 0.5],
      ['ri', 'ri', 65, 0.5], ['spon', 'spon', 69, 0.5], ['de al ', 'de', 69, 0.5], ['vo', 'vo', 72, 0.5], ['lo, ', 'lo', 69, 1.5], ['', null, null, 0.5],
    ] },
    { bar: 18, syl: [
      ['e il ', 'e', 64, 0.5], ['co', 'co', 67, 0.5], ['di', 'di', 67, 0.5], ['ce ', 'ce', 72, 0.5], ['gi', 'gi', 67, 0.5], ['ra al ', 'ra', 72, 0.5], ['pri', 'pri', 67, 0.5], ['mo ', 'mo', 72, 0.5],
      ['col', 'col', 74, 1], ['po!', 'po', 71, 2], ['', null, null, 1],
    ] },
    // The breakdown: no kick, happily ever after, but not the end.
    { bar: 20, syl: [
      ['E ', 'e', 60, 0.5], ['vis', 'vis', 65, 0.5], ['se', 'se', 65, 0.5], ['ro ', 'ro', 64, 0.5], ['tut', 'tut', 65, 0.5], ['ti ', 'ti', 64, 0.5], ['fe', 'fe', 69, 0.5], ['li', 'li', 67, 0.5],
      ['ci e ', 'ci', 64, 0.5], ['con', 'con', 67, 0.5], ['ten', 'ten', 72, 1], ['ti… ', 'ti', 67, 1.5], ['', null, null, 0.5],
    ] },
    { bar: 22, syl: [
      ['ma ', 'ma', 62, 0.5], ['la ', 'la', 65, 0.5], ['fa', 'fa', 69, 1], ['vo', 'vo', 65, 0.5], ['la… ', 'la', 62, 1], ['', null, null, 0.5],
      ['non ', 'non', 67, 0.5], ['fi', 'fi', 67, 0.5], ['ni', 'ni', 67, 0.5], ['sce ', 'sce', 74, 0.5], ['qui!', 'kui', 67, 1.5], ['', null, null, 0.5],
    ] },
    // The chorus again.
    { bar: 24, syl: [
      ['Fa', 'fei', 76, 0.5], ['ble! ', 'bol', 72, 1], ['Fa', 'fei', 76, 0.5], ['ble! ', 'bol', 72, 1], ['Cin', 'cin', 67, 0.5], ['que ', 'kue', 67, 0.5],
      ['pun', 'pun', 71, 0.5], ['to ', 'to', 71, 0.5], ['du', 'du', 74, 1], ['e!', 'e', 74, 1.5], ['', null, null, 0.5],
    ] },
    { bar: 26, syl: [
      ['Sal', 'sal', 76, 0.5], ['ta, ', 'ta', 72, 1], ['bal', 'bal', 76, 0.5], ['la, ', 'la', 72, 1], ['muo', 'muo', 69, 0.5], ['vi il ', 'vi', 64, 0.5],
      ['cu', 'cu', 69, 0.5], ['let', 'let', 72, 0.5], ['to!', 'to', [77, 72], [1.5, 1]], ['', null, null, 0.5],
    ] },
    // The stop: the last chapter, the kick out, a roll.
    { bar: 28, syl: [
      ['Ul', 'ul', 67, 0.5], ['ti', 'ti', 67, 0.5], ['mo ', 'mo', 71, 1], ['ca', 'ca', 67, 0.5], ['pi', 'pi', 67, 0.5], ['to', 'to', 71, 0.5], ['lo… ', 'lo', 74, 0.5],
      ['', null, null, 0.5], ['a', 'a', 73, 0.5], ['des', 'des', 76, 0.5], ['so!', 'so', 76, 2], ['', null, null, 0.5],
    ] },
    // The last drop, a tone higher: dancing for ever.
    { bar: 30, syl: [
      ['Fa', 'fei', 78, 0.5], ['ble! ', 'bol', 74, 1], ['Fa', 'fei', 78, 0.5], ['ble! ', 'bol', 74, 1], ['Cin', 'cin', 66, 0.5], ['que ', 'kue', 69, 0.5],
      ['pun', 'pun', 73, 0.5], ['to ', 'to', 73, 0.5], ['du', 'du', 76, 1], ['e!', 'e', 76, 1.5], ['', null, null, 0.5],
    ] },
    { bar: 32, syl: [
      ['Sal', 'sal', 78, 0.5], ['ta, ', 'ta', 74, 1], ['bal', 'bal', 78, 0.5], ['la, ', 'la', 74, 1], ['muo', 'muo', 71, 0.5], ['vi il ', 'vi', 66, 0.5],
      ['cu', 'cu', 71, 0.5], ['let', 'let', 74, 0.5], ['to!', 'to', [78, 74], [1.5, 1]], ['', null, null, 0.5],
    ] },
    { bar: 34, syl: [
      ['e ', 'e', 66, 0.5], ['vis', 'vis', 66, 0.5], ['se', 'se', 74, 0.5], ['ro ', 'ro', 74, 0.5], ['tut', 'tut', 76, 0.5], ['ti ', 'ti', 66, 0.5], ['bal', 'bal', 74, 0.5], ['lan', 'lan', 78, 0.5],
      ['do ', 'do', 76, 0.5], ['per ', 'per', 73, 0.5], ['sem', 'sem', 76, 0.5], ['pre!', 'pre', [76, 73], [1, 1]], ['', null, null, 0.5],
    ] },
    { bar: 36, syl: [
      ['Fa', 'fei', 78, 0.5], ['ble! ', 'bol', 74, 1], ['Fa', 'fei', 78, 0.5], ['ble! ', 'bol', 74, 1], ['Cin', 'cin', 66, 0.5], ['que ', 'kue', 71, 0.5],
      ['pun', 'pun', 74, 0.5], ['to ', 'to', 74, 0.5], ['DU', 'du', 76, 1], ['E!', 'e', 76, 1.5], ['', null, null, 0.5],
    ] },
  ],
}
