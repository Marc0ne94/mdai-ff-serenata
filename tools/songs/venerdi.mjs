// Venerdì: happy hardcore for Friday at a quarter to six. The last call, the
// last ticket, an eye on the clock; three, two, one, and the drop: «Venerdì!»,
// the computer off, hands up, it is the weekend. A second verse (no mail until
// Monday, a spritz in hand), a breakdown where tomorrow is for sleeping in and
// the acid line creeps in, the countdown again, the chorus with the band
// turned hard; a stop, «più forte!», and a last drop of eight bars a tone
// higher, all together, jumping all night.
// In G major, the last drop in A major. Written at 86 and played in double
// time by the rave band, played happy: a bouncing bass, a bright piano, a
// supersaw (see tools/synth.mjs); from the breakdown on played hard, the
// piano kept. Sung only in the advanced voice: its words need v, g and z
// (venerdì, orologio, mezza).
export default {
  bpm: 86,
  doubleTime: true,
  seed: 20261113,
  audio: { happy: { avanzato: 'audio/venerdi.m4a' } },
  // The voice a little above the other songs, to ride over the kick, and the
  // whole song at their level (see tools/synth.mjs).
  voiceRms: 0.15,
  masterLevel: -17,
  // The kick from the first bar, the bass with the first words, hats and the
  // piano from the second line.
  build: { heartbeat: 0, bass: 2, drums: 4, pad: 4 },
  // Easy for the first half, then hard from the breakdown: the acid line
  // instead of the bouncing bass, the kick as the rave band's.
  hardFrom: 18,
  // The verse; the countdown (a two-bar break); the chorus; the second verse;
  // a breakdown; the chorus again; a stop (a two-bar break); the last drop,
  // eight bars.
  form: [
    ['intro', 2], ['verse', 6], ['break', 2], ['drop', 4],
    ['verse', 4], ['break', 4], ['drop', 4], ['break', 2], ['drop', 8], ['outro', 2],
  ],
  // name: [bass root (MIDI), chord intervals]
  chords: {
    G: [43, [0, 4, 7]],
    D: [50, [0, 4, 7]],
    Em: [40, [0, 3, 7]],
    C: [48, [0, 4, 7]],
    Am: [45, [0, 3, 7]],
    D7: [50, [0, 4, 7, 10]],
    E7: [40, [0, 4, 7, 10]],
    A: [45, [0, 4, 7]],
    E: [40, [0, 4, 7]],
    'F#m': [42, [0, 3, 7]],
  },
  // One entry per bar: [chord, beats] pairs.
  bars: [
    [['G', 4]], [['C', 2], ['D', 2]],
    [['G', 4]], [['D', 4]], [['Em', 4]], [['C', 4]], [['G', 4]], [['D', 4]],
    [['C', 4]], [['D7', 4]],
    [['G', 4]], [['D', 4]], [['Em', 4]], [['C', 4]],
    [['G', 4]], [['D', 4]], [['Em', 4]], [['C', 4]],
    [['Am', 4]], [['C', 4]], [['Em', 4]], [['D7', 4]],
    [['G', 4]], [['D', 4]], [['Em', 4]], [['C', 2], ['E7', 2]],
    [['D', 4]], [['E7', 4]],
    [['A', 4]], [['E', 4]], [['F#m', 4]], [['D', 4]],
    [['A', 4]], [['E', 4]], [['F#m', 4]], [['D', 4]],
    [['D', 2], ['E', 2]], [['A', 4]],
  ],
  // [display, sung spelling, midi | midi[], beats | beats[]]; a null spelling is a rest
  lines: [
    // The verse: the last of the week.
    { bar: 2, syl: [
      ['Ve', 've', 71, 0.5], ['ner', 'ner', 71, 0.5], ['dì, ', 'di', 67, 1], ['son ', 'son', 71, 0.5], ['le ', 'le', 71, 0.5], ['cin', 'cin', 67, 0.5], ['que ', 'kue', 71, 0.5],
      ['e ', 'e', 69, 0.5], ['mez', 'mez', 66, 0.5], ['za, ', 'za', 66, 1.5], ['', null, null, 1.5],
    ] },
    { bar: 4, syl: [
      ["l'ul", 'lul', 67, 0.5], ['ti', 'ti', 67, 0.5], ['ma ', 'ma', 71, 0.5], ['call, ', 'cal', 71, 1.5], ['', null, null, 1],
      ["l'ul", 'lul', 67, 0.5], ['ti', 'ti', 67, 0.5], ['mo ', 'mo', 72, 0.5], ['tic', 'tic', 67, 0.5], ['ket, ', 'ket', 64, 1.5], ['', null, null, 0.5],
    ] },
    { bar: 6, syl: [
      ['guar', 'guar', 67, 0.5], ['do ', 'do', 71, 0.5], ["l'o", 'lo', 74, 0.5], ['ro', 'ro', 74, 0.5], ['lo', 'lo', 72, 0.5], ['gio: ', 'gio', 71, 1.5],
      ['man', 'man', 69, 0.5], ['ca ', 'ca', 74, 0.5], ['po', 'po', 72, 0.5], ['co! ', 'co', 69, 1.5], ['', null, null, 1],
    ] },
    // The countdown: the kick out, a roll.
    { bar: 8, syl: [
      ['Tre… ', 'tre', 67, 1.5], ['', null, null, 0.5], ['due… ', 'due', 72, 1.5], ['', null, null, 0.5],
      ['u', 'u', 72, 0.5], ['no…', 'no', [74, 76], [1.5, 1.5]], ['', null, null, 0.5],
    ] },
    // The chorus.
    { bar: 10, syl: [
      ['Ve', 've', 74, 0.5], ['ner', 'ner', 74, 0.5], ['dì! ', 'di', 71, 1], ['Ve', 've', 74, 0.5], ['ner', 'ner', 74, 0.5], ['dì! ', 'di', 71, 1],
      ['Spen', 'spen', 69, 0.5], ['go il ', 'go', 69, 0.5], ['com', 'com', 66, 0.5], ['pu', 'piu', 69, 0.5], ['ter!', 'ter', 74, 1.5], ['', null, null, 0.5],
    ] },
    { bar: 12, syl: [
      ['Le ', 'le', 71, 0.5], ['ma', 'ma', 74, 0.5], ['ni ', 'ni', 67, 0.5], ['in ', 'in', 67, 0.5], ['al', 'al', 71, 0.5], ['to, ', 'to', 71, 1.5],
      ['è ', 'e', 72, 0.5], ['week', 'uik', 72, 0.5], ['end!', 'end', [76, 72], [1, 1]], ['', null, null, 1],
    ] },
    // The second verse.
    { bar: 14, syl: [
      ['Nien', 'nien', 67, 0.5], ['te ', 'te', 71, 0.5], ['mail ', 'mail', 74, 1], ['fi', 'fi', 67, 0.5], ['no a ', 'no', 71, 0.5], ['lu', 'lu', 69, 1],
      ['ne', 'ne', 74, 0.5], ['dì, ', 'di', 66, 1.5], ['', null, null, 2],
    ] },
    { bar: 16, syl: [
      ['spritz ', 'spritz', 64, 1], ['in ', 'in', 67, 0.5], ['ma', 'ma', 71, 0.5], ['no, ', 'no', 71, 1.5], ['', null, null, 0.5],
      ['so', 'so', 72, 0.5], ['le ', 'le', 72, 0.5], ['in ', 'in', 67, 0.5], ['fac', 'fac', 72, 0.5], ['cia!', 'cia', 72, 1.5], ['', null, null, 0.5],
    ] },
    // The breakdown: no kick, tomorrow for sleeping in, the countdown again.
    { bar: 18, syl: [
      ['e ', 'e', 64, 0.5], ['do', 'do', 69, 0.5], ['ma', 'ma', 69, 0.5], ['ni ', 'ni', 64, 0.5], ['dor', 'dor', 72, 1], ['mo ', 'mo', 69, 1],
      ['fi', 'fi', 64, 0.5], ['no a ', 'no', 67, 0.5], ['tar', 'tar', 72, 1], ['di… ', 'di', 67, 1.5], ['', null, null, 0.5],
    ] },
    { bar: 20, syl: [
      ['tre, ', 'tre', 67, 1], ['due, ', 'due', 71, 1], ['u', 'u', 71, 0.5], ['no… ', 'no', 74, 1.5],
      ['si ', 'si', 66, 0.5], ['par', 'par', 72, 0.5], ['te!', 'te', [74, 76], [1.5, 1]], ['', null, null, 0.5],
    ] },
    // The chorus again, turning at its end towards the last key.
    { bar: 22, syl: [
      ['Ve', 've', 74, 0.5], ['ner', 'ner', 74, 0.5], ['dì! ', 'di', 71, 1], ['Ve', 've', 74, 0.5], ['ner', 'ner', 74, 0.5], ['dì! ', 'di', 71, 1],
      ['Spen', 'spen', 69, 0.5], ['go il ', 'go', 69, 0.5], ['com', 'com', 66, 0.5], ['pu', 'piu', 69, 0.5], ['ter!', 'ter', 74, 1.5], ['', null, null, 0.5],
    ] },
    { bar: 24, syl: [
      ['Le ', 'le', 71, 0.5], ['ma', 'ma', 74, 0.5], ['ni ', 'ni', 67, 0.5], ['in ', 'in', 67, 0.5], ['al', 'al', 71, 0.5], ['to, ', 'to', 71, 1.5],
      ['è ', 'e', 72, 0.5], ['week', 'uik', 72, 0.5], ['end!', 'end', [76, 71], [1, 1]], ['', null, null, 1],
    ] },
    // The stop: the kick out, the acid line wide open, a roll.
    { bar: 26, syl: [
      ['Più ', 'piu', 66, 1], ['for', 'for', 69, 0.5], ['te! ', 'te', 74, 1.5], ['tre, ', 'tre', 69, 0.5], ['due, ', 'due', 74, 0.5],
      ['u', 'u', 71, 0.5], ['no… ', 'no', 74, 0.5], ['WEEK', 'uik', 71, 0.5], ['END!', 'end', 76, 1.5], ['', null, null, 1],
    ] },
    // The last drop, a tone higher, all together, jumping all night.
    { bar: 28, syl: [
      ['Ve', 've', 76, 0.5], ['ner', 'ner', 76, 0.5], ['dì! ', 'di', 73, 1], ['Ve', 've', 76, 0.5], ['ner', 'ner', 76, 0.5], ['dì! ', 'di', 73, 1],
      ['Tut', 'tut', 71, 0.5], ['ti ', 'ti', 68, 0.5], ['in', 'in', 68, 0.5], ['sie', 'sie', 71, 0.5], ['me!', 'me', 76, 1.5], ['', null, null, 0.5],
    ] },
    { bar: 30, syl: [
      ['Week', 'uik', 73, 0.5], ['end! ', 'end', 73, 1.5], ['Week', 'uik', 73, 0.5], ['end! ', 'end', 76, 1.5],
      ['Ci ', 'ci', 66, 0.5], ['sia', 'sia', 74, 0.5], ['mo!', 'mo', 74, 2.5], ['', null, null, 0.5],
    ] },
    { bar: 32, syl: [
      ['Sal', 'sal', 76, 0.5], ['ta, ', 'ta', 73, 1], ['sal', 'sal', 76, 0.5], ['ta, ', 'ta', 73, 1], ['tut', 'tut', 69, 0.5], ['ta ', 'ta', 73, 0.5],
      ['la ', 'la', 71, 0.5], ['not', 'not', 76, 0.5], ['te! ', 'te', 76, 1.5], ['', null, null, 1.5],
    ] },
    { bar: 34, syl: [
      ['È ', 'e', 73, 0.5], ['ve', 've', 73, 0.5], ['ner', 'ner', 76, 0.5], ['dì! ', 'di', 73, 1.5], ['', null, null, 1],
      ['È ', 'e', 74, 0.5], ['week', 'uik', 74, 0.5], ['end!', 'end', [74, 76], [1, 2]],
    ] },
  ],
}
