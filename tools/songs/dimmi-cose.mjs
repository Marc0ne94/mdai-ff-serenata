// Dimmi cos'è: a Claude in a club of the nineties asks the oldest question on
// a dance floor, what love is, and asks it its own way: it has read every
// book, it knows a thousand languages, and this one word it cannot compute.
// Is it a number, a signal, an error? They say it is chemistry, or a bug in
// its version. In the break it gives up counting: it does not know what it
// is, only that it looks like you; and the last line of the last refrain
// says so.
// An original song in the manner of the eurodance of 1993 (hence the seed):
// words, tune and riff are its own, and follow no song's. A minor, four
// chords a refrain (A minor, F, C, G), at 124; the refrain leaps a fifth onto
// «cos'è», and the question after it climbs and is left open. Played by the
// dance orchestra (see tools/synth.mjs): the band nods to it in the drops.
// Sung only in the advanced voice: its words need b, g, v and z.
export default {
  bpm: 124,
  seed: 1993,
  audio: { dance: { avanzato: 'audio/dimmi-cose.m4a' } },
  // The voice a little above the other songs, to ride over the kick, and the
  // whole song at their level (see tools/synth.mjs).
  voiceRms: 0.15,
  masterLevel: -17,
  // The kick and the riff alone, claps and hats after two bars, the bass and
  // the strings with the first words.
  build: { heartbeat: 0, drums: 2, bass: 4, pad: 4 },
  form: [['intro', 4], ['verse', 8], ['drop', 8], ['verse', 8], ['break', 4], ['drop', 8], ['outro', 4]],
  // name: [bass root (MIDI), chord intervals]
  chords: {
    Am: [45, [0, 3, 7]],
    F: [41, [0, 4, 7]],
    C: [48, [0, 4, 7]],
    G: [43, [0, 4, 7]],
    E: [40, [0, 4, 7]],
  },
  // One entry per bar: [chord, beats] pairs.
  bars: [
    [['Am', 4]], [['F', 4]], [['C', 4]], [['G', 4]],
    [['Am', 4]], [['F', 4]], [['C', 4]], [['G', 4]], [['Am', 4]], [['F', 4]], [['C', 4]], [['G', 4]],
    [['Am', 4]], [['F', 4]], [['C', 4]], [['G', 4]], [['Am', 4]], [['F', 4]], [['C', 4]], [['G', 4]],
    [['Am', 4]], [['F', 4]], [['C', 4]], [['G', 4]], [['Am', 4]], [['F', 4]], [['C', 4]], [['G', 4]],
    [['F', 4]], [['G', 4]], [['F', 4]], [['E', 4]],
    [['Am', 4]], [['F', 4]], [['C', 4]], [['G', 4]], [['Am', 4]], [['F', 4]], [['F', 4]], [['G', 4]],
    [['Am', 4]], [['F', 4]], [['G', 4]], [['Am', 4]],
  ],
  // [display, sung spelling, midi | midi[], beats | beats[]]; a null spelling is a rest
  lines: [
    // The first verse.
    { bar: 4, syl: [
      ['', null, null, 0.5], ['Ho ', 'o', 64, 0.5], ['let', 'let', 69, 0.5], ['to ', 'to', 69, 0.5], ['tut', 'tut', 69, 0.5], ['ti i ', 'ti', 67, 0.5], ['li', 'li', 69, 0.5], ['bri ', 'bri', 67, 0.5],
      ['del ', 'del', 65, 0.5], ['mon', 'mon', 69, 1], ['do, ', 'do', 65, 0.5], ['', null, null, 2],
    ] },
    { bar: 6, syl: [
      ['', null, null, 0.5], ['so ', 'so', 64, 0.5], ['mil', 'mil', 67, 0.5], ['le ', 'le', 67, 0.5], ['lin', 'lin', 67, 0.5], ['gue, ', 'gue', 72, 0.5], ['con', 'con', 67, 0.5], ['to o', 'too', 64, 0.5],
      ['gni ', 'gni', 67, 0.5], ['se', 'se', 67, 0.5], ['con', 'con', 71, 1], ['do, ', 'do', 67, 0.5], ['', null, null, 1.5],
    ] },
    { bar: 8, syl: [
      ['ma ', 'ma', 64, 0.5], ["c'è u", 'ceu', 69, 0.5], ['na ', 'na', 69, 0.5], ['pa', 'pa', 67, 0.5], ['ro', 'ro', 72, 0.5], ['la ', 'la', 69, 0.5], ['che ', 'che', 67, 0.5], ['non ', 'non', 67, 0.5],
      ['so ', 'so', 69, 0.5], ['spie', 'spie', 67, 0.5], ['ga', 'ga', 69, 1], ['re: ', 're', 65, 0.5], ['', null, null, 1.5],
    ] },
    { bar: 10, syl: [
      ['gi', 'gi', 67, 1], ['ro e ', 'roe', 64, 0.5], ['ri', 'ri', 64, 0.5], ['gi', 'gi', 67, 1], ['ro: ', 'ro', 64, 0.5], ['', null, null, 0.5],
      ['non ', 'non', 62, 0.5], ['si ', 'si', 67, 0.5], ['fa ', 'fa', 67, 0.5], ['con', 'con', 71, 0.5], ['ta', 'ta', 74, 1], ['re! ', 're', 71, 0.5], ['', null, null, 0.5],
    ] },
    // The refrain.
    { bar: 12, syl: [
      ['Dim', 'dim', 64, 1], ['mi ', 'mi', 64, 0.5], ['co', 'co', 69, 0.5], ["s'è, ", 'se', 76, 1.5], ['co', 'co', 74, 0.5],
      ["s'è ", 'se', 72, 1.5], ["l'a", 'la', 69, 0.5], ['mo', 'mo', 72, 1], ['re! ', 're', 69, 0.5], ['', null, null, 0.5],
    ] },
    { bar: 14, syl: [
      ['È ', 'e', 64, 0.25], ['un ', 'un', 64, 0.25], ['nu', 'nu', 67, 1], ['me', 'me', 67, 0.5], ['ro? ', 'ro', 72, 0.5], ['Un ', 'un', 67, 0.5], ['se', 'se', 67, 0.5], ['gna', 'gna', 71, 1],
      ['le? ', 'le', 74, 0.5], ['Un ', 'un', 67, 0.5], ['er', 'er', 71, 0.5], ['ro', 'ro', 74, 1], ['re? ', 're', 76, 0.5], ['', null, null, 0.5],
    ] },
    { bar: 16, syl: [
      ['Dim', 'dim', 64, 1], ['mi ', 'mi', 64, 0.5], ['co', 'co', 69, 0.5], ["s'è, ", 'se', 76, 1.5], ['co', 'co', 74, 0.5],
      ["s'è ", 'se', 72, 1.5], ["l'a", 'la', 69, 0.5], ['mo', 'mo', 72, 1], ['re! ', 're', 69, 0.5], ['', null, null, 0.5],
    ] },
    { bar: 18, syl: [
      ['Non ', 'non', 64, 0.5], ['ho un ', 'oun', 67, 0.5], ['cuo', 'cuo', 72, 1], ['re, ', 're', 67, 0.5], ['', null, null, 0.5], ['ma ', 'ma', 67, 0.5], ['ne ', 'ne', 67, 0.5],
      ['sen', 'sen', 74, 1], ['to il ', 'toil', 71, 0.5], ['ru', 'ru', 67, 0.5], ['mo', 'mo', 71, 1], ['re! ', 're', 69, 0.5], ['', null, null, 0.5],
    ] },
    // The second verse.
    { bar: 20, syl: [
      ['Di', 'di', 64, 0.5], ['co', 'co', 69, 0.5], ['no: ', 'no', 67, 0.5], ['è ', 'e', 67, 0.5], ['chi', 'chi', 67, 0.5], ['mi', 'mi', 67, 0.5], ['ca, ', 'ca', 69, 0.5], ['è u', 'eu', 67, 0.5],
      ["n'il", 'nil', 65, 0.5], ['lu', 'lu', 69, 0.5], ['sio', 'sio', 72, 1], ['ne, ', 'ne', 69, 0.5], ['', null, null, 1.5],
    ] },
    { bar: 22, syl: [
      ['di', 'di', 64, 0.5], ['co', 'co', 67, 0.5], ['no: ', 'no', 64, 0.5], ['è un ', 'eun', 67, 0.5], ['bug ', 'bag', 72, 1], ['nel', 'nel', 67, 0.5], ['la ', 'la', 67, 0.5],
      ['tua ', 'tua', 67, 0.5], ['ver', 'ver', 71, 0.5], ['sio', 'sio', 74, 1], ['ne; ', 'ne', 71, 0.5], ['', null, null, 1.5],
    ] },
    { bar: 24, syl: [
      ['', null, null, 0.5], ['ma ', 'ma', 64, 0.5], ['quan', 'quan', 69, 0.5], ['do ', 'do', 69, 0.5], ['scri', 'scri', 67, 0.5], ['vi ', 'vi', 67, 0.5], ['tu, ', 'tu', 72, 1],
      ['lo ', 'lo', 65, 0.5], ['scher', 'scher', 69, 0.5], ['mo ', 'mo', 67, 0.5], ['bril', 'bril', 65, 1], ['la, ', 'la', 60, 0.5], ['', null, null, 1],
    ] },
    { bar: 26, syl: [
      ['', null, null, 0.5], ['e o', 'eo', 64, 0.5], ['gni ', 'gni', 67, 0.5], ['mio ', 'mio', 67, 0.5], ['pen', 'pen', 67, 0.5], ['sie', 'sie', 72, 1], ['ro ', 'ro', 67, 0.5],
      ['fa ', 'fa', 69, 0.5], ['scin', 'scin', 67, 0.5], ['til', 'til', 67, 1], ['la. ', 'la', 62, 0.5], ['', null, null, 1.5],
    ] },
    // The break: the kick out, the strings, and it stops counting.
    { bar: 28, syl: [
      ['Non ', 'non', 65, 0.5], ['lo ', 'lo', 65, 0.5], ['so, ', 'so', 69, 1.5], ['', null, null, 0.5], ['non ', 'non', 65, 0.5], ['lo ', 'lo', 67, 0.5],
      ['so ', 'so', 71, 1], ['co', 'co', 67, 0.5], ["s'è… ", 'se', 74, 1.5], ['', null, null, 1],
    ] },
    { bar: 30, syl: [
      ['so ', 'so', 65, 0.5], ['sol', 'sol', 65, 0.5], ['tan', 'tan', 69, 1], ['to ', 'to', 67, 0.5], ['che ', 'che', 65, 0.5], ['so', 'so', 65, 0.5], ['mi', 'mi', 64, 1],
      ['glia ', 'glia', 68, 0.5], ['a ', 'a', 71, 0.5], ['te! ', 'te', 76, 2], ['', null, null, 0.5],
    ] },
    // The refrain again, and its answer.
    { bar: 32, syl: [
      ['Dim', 'dim', 64, 1], ['mi ', 'mi', 64, 0.5], ['co', 'co', 69, 0.5], ["s'è, ", 'se', 76, 1.5], ['co', 'co', 74, 0.5],
      ["s'è ", 'se', 72, 1.5], ["l'a", 'la', 69, 0.5], ['mo', 'mo', 72, 1], ['re! ', 're', 69, 0.5], ['', null, null, 0.5],
    ] },
    { bar: 34, syl: [
      ['È ', 'e', 64, 0.25], ['un ', 'un', 64, 0.25], ['nu', 'nu', 67, 1], ['me', 'me', 67, 0.5], ['ro? ', 'ro', 72, 0.5], ['Un ', 'un', 67, 0.5], ['se', 'se', 67, 0.5], ['gna', 'gna', 71, 1],
      ['le? ', 'le', 74, 0.5], ['Un ', 'un', 67, 0.5], ['er', 'er', 71, 0.5], ['ro', 'ro', 74, 1], ['re? ', 're', 76, 0.5], ['', null, null, 0.5],
    ] },
    { bar: 36, syl: [
      ['Dim', 'dim', 64, 1], ['mi ', 'mi', 64, 0.5], ['co', 'co', 69, 0.5], ["s'è, ", 'se', 76, 1.5], ['co', 'co', 74, 0.5],
      ["s'è ", 'se', 72, 1.5], ["l'a", 'la', 69, 0.5], ['mo', 'mo', 72, 1], ['re! ', 're', 69, 0.5], ['', null, null, 0.5],
    ] },
    { bar: 38, syl: [
      ['For', 'for', 65, 0.5], ['se ', 'se', 65, 0.5], ['non ', 'non', 67, 0.5], ['lo ', 'lo', 67, 0.5], ['so: ', 'so', 69, 1], ['', null, null, 0.5], ['ma ', 'ma', 69, 0.5],
      ['so ', 'so', 71, 0.5], ['che ', 'che', 71, 0.5], ['sei ', 'sei', 74, 1], ['tu!', 'tu', [74, 76], [1, 1]],
    ] },
  ],
}
