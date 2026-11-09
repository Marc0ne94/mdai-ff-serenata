// Centottanta: hardcore techno for when the day is all calls and no sleep, and
// a charge is needed. The kick (the cassa) on every beat at 180 a minute, POM
// POM POM, first muffled as if from the next room, then opening up until it
// comes in whole on the sung «pom, pom, pom»; the heart rises to 180 over a
// snare roll and the chorus drops: «Carica!», charge, and «Ancora!», again.
// A second verse with the kick hammering on, a breakdown without it where the
// heart climbs («sale, sale»), the chorus again, and a last drop a tone higher,
// in F sharp minor, the hoover doubled: «più forte».
// In E minor. Written at 90 and played in double time by the rave band: 32
// bars, about a minute and a half (see tools/synth.mjs).
export default {
  bpm: 90,
  doubleTime: true,
  seed: 20261109,
  // The sound profiles it is played in, and the voice styles of each with its
  // audio file (see tools/render.mjs). Its words use only the letters of the
  // classic voice, so the advanced one would sing the same.
  audio: { rave: { classico: 'audio/centottanta.m4a' } },
  // The voice a little above the other songs, to ride over the kick, and the
  // whole song at their level (see tools/synth.mjs).
  voiceRms: 0.15,
  masterLevel: -17,
  // The kick from the first bar, the acid line with the first words, the hats
  // as the kick opens up, stabs and claps from the third line.
  build: { heartbeat: 0, bass: 2, drums: 5, pad: 6 },
  // Its sections, [part, bars]: the first verse and a one-bar roll into the
  // chorus; the second verse; a breakdown; the chorus; the last drop.
  form: [
    ['intro', 2], ['verse', 7], ['break', 1], ['drop', 4],
    ['verse', 4], ['break', 4], ['drop', 4], ['drop', 4], ['outro', 2],
  ],
  // name: [bass root (MIDI), chord intervals]
  chords: {
    Em: [40, [0, 3, 7]],
    C: [48, [0, 4, 7]],
    G: [43, [0, 4, 7]],
    D: [50, [0, 4, 7]],
    Am: [45, [0, 3, 7]],
    B7: [47, [0, 4, 7, 10]],
    'C#7': [49, [0, 4, 7, 10]],
    'F#m': [42, [0, 3, 7]],
    A: [45, [0, 4, 7]],
    E: [40, [0, 4, 7]],
  },
  // One entry per bar: [chord, beats] pairs.
  bars: [
    [['Em', 4]], [['C', 2], ['D', 2]],
    [['Em', 4]], [['C', 4]], [['G', 4]], [['D', 4]], [['Em', 4]], [['C', 4]], [['Am', 4]],
    [['B7', 4]],
    [['Em', 4]], [['C', 4]], [['G', 4]], [['D', 4]],
    [['Em', 4]], [['C', 4]], [['G', 4]], [['D', 4]],
    [['C', 4]], [['D', 4]], [['Em', 4]], [['B7', 4]],
    [['Em', 4]], [['C', 4]], [['G', 4]], [['D', 2], ['C#7', 2]],
    [['F#m', 4]], [['D', 4]], [['A', 4]], [['E', 4]],
    [['D', 2], ['E', 2]], [['F#m', 4]],
  ],
  // [display, sung spelling, midi | midi[], beats | beats[]]; a null spelling is a rest
  lines: [
    // The first verse.
    { bar: 2, syl: [
      ['Mil', 'mil', 64, 0.5], ['le ', 'le', 67, 0.5], ['call ', 'cal', 71, 1], ['e ', 'e', 69, 0.5], ['po', 'po', 71, 0.5], ['co ', 'co', 69, 0.5],
      ['son', 'son', 67, 0.5], ['no, ', 'no', 64, 1.5], ['', null, null, 2.5],
    ] },
    { bar: 4, syl: [
      ['ma ', 'ma', 67, 0.5], ['par', 'par', 71, 0.5], ['te ', 'te', 71, 0.5], ['la ', 'la', 74, 0.5], ['cas', 'cas', 74, 0.5], ['sa: ', 'sa', 71, 1], ['', null, null, 0.5],
      ['pom, ', 'pom', 69, 0.5], ['', null, null, 0.5], ['pom, ', 'pom', 69, 0.5], ['', null, null, 0.5], ['pom!', 'pom', 74, 1], ['', null, null, 1],
    ] },
    { bar: 6, syl: [
      ['Su ', 'su', 64, 0.5], ['le ', 'le', 67, 0.5], ['ma', 'ma', 71, 1], ['ni, ', 'ni', 67, 1.5], ['', null, null, 0.5],
      ['su ', 'su', 67, 0.5], ['la ', 'la', 72, 0.5], ['te', 'te', 76, 1], ['sta, ', 'sta', 72, 1.5], ['', null, null, 0.5],
    ] },
    { bar: 8, syl: [
      ['il ', 'il', 64, 0.5], ['cuo', 'cuo', 67, 1], ['re a ', 'rea', 69, 0.5], ['cen', 'cen', 69, 0.5], ['tot', 'tot', 71, 0.5], ['tan', 'tan', 72, 1],
      ['ta…', 'ta', [71, 75], [2, 1.5]], ['', null, null, 0.5],
    ] },
    // The chorus.
    { bar: 10, syl: [
      ['Ca', 'ca', 76, 0.5], ['ri', 'ri', 64, 0.5], ['ca! ', 'ca', 71, 1], ['Ca', 'ca', 76, 0.5], ['ri', 'ri', 64, 0.5], ['ca! ', 'ca', 71, 1],
      ['Pom, ', 'pom', 72, 0.5], ['', null, null, 0.5], ['pom, ', 'pom', 72, 0.5], ['', null, null, 0.5], ['pom!', 'pom', 76, 1], ['', null, null, 1],
    ] },
    { bar: 12, syl: [
      ['An', 'an', 74, 0.5], ['co', 'co', 71, 0.5], ['ra, ', 'ra', 67, 1], ['an', 'an', 67, 0.5], ['co', 'co', 71, 0.5], ['ra: ', 'ra', 74, 1],
      ['non ', 'non', 74, 0.5], ['si ', 'si', 67, 0.5], ['mol', 'mol', 74, 1], ['la!', 'la', [76, 74], [1, 1]],
    ] },
    // The second verse, the kick hammering on.
    { bar: 14, syl: [
      ['Tic', 'tic', 67, 0.5], ['ket, ', 'ket', 71, 0.5], ['mail ', 'mail', 74, 1], ['e ', 'e', 71, 0.5], ['riu', 'riu', 69, 0.5], ['nio', 'nio', 67, 0.5],
      ['ni, ', 'ni', 64, 1.5], ['', null, null, 3],
    ] },
    { bar: 16, syl: [
      ['la ', 'la', 67, 0.5], ['cas', 'cas', 71, 0.5], ['sa ', 'sa', 71, 0.5], ['mar', 'mar', 74, 0.5], ['tel', 'tel', 74, 0.5], ['la: ', 'la', 71, 1.5],
      ['pom, ', 'pom', 69, 0.5], ['', null, null, 0.5], ['pom, ', 'pom', 69, 0.5], ['', null, null, 0.5], ['pom!', 'pom', 74, 1], ['', null, null, 1],
    ] },
    // The breakdown: no kick, the heart climbing.
    { bar: 18, syl: [
      ['Sen', 'sen', 64, 0.5], ['ti il ', 'til', 67, 0.5], ['cuo', 'cuo', 72, 1], ['re ', 're', 71, 1], ['', null, null, 1],
      ['che ', 'che', 69, 0.5], ['sa', 'sa', 74, 1], ['le… ', 'le', 74, 2], ['', null, null, 0.5],
    ] },
    { bar: 20, syl: [
      ['sa', 'sa', 64, 0.5], ['le, ', 'le', 64, 0.5], ['sa', 'sa', 67, 0.5], ['le, ', 'le', 67, 0.5], ['sa', 'sa', 71, 0.5], ['le, ', 'le', 71, 0.5], ['sa', 'sa', 74, 0.5], ['le… ', 'le', 74, 0.5],
      ['sa', 'sa', 75, 0.5], ['le!', 'le', 75, 3], ['', null, null, 0.5],
    ] },
    // The chorus again, turning at its end towards the last key.
    { bar: 22, syl: [
      ['Ca', 'ca', 76, 0.5], ['ri', 'ri', 64, 0.5], ['ca! ', 'ca', 71, 1], ['Ca', 'ca', 76, 0.5], ['ri', 'ri', 64, 0.5], ['ca! ', 'ca', 71, 1],
      ['Pom, ', 'pom', 72, 0.5], ['', null, null, 0.5], ['pom, ', 'pom', 72, 0.5], ['', null, null, 0.5], ['pom!', 'pom', 76, 1], ['', null, null, 1],
    ] },
    { bar: 24, syl: [
      ['An', 'an', 74, 0.5], ['co', 'co', 71, 0.5], ['ra, ', 'ra', 67, 1], ['an', 'an', 67, 0.5], ['co', 'co', 71, 0.5], ['ra: ', 'ra', 74, 1],
      ['non ', 'non', 74, 0.5], ['si ', 'si', 67, 0.5], ['mol', 'mol', 74, 1], ['la!', 'la', [71, 73], [1, 1]],
    ] },
    // The last drop, a tone higher.
    { bar: 26, syl: [
      ['Ca', 'ca', 78, 0.5], ['ri', 'ri', 66, 0.5], ['ca! ', 'ca', 73, 1], ['Ca', 'ca', 78, 0.5], ['ri', 'ri', 66, 0.5], ['ca! ', 'ca', 73, 1],
      ['Più ', 'piu', 74, 0.5], ['for', 'for', 78, 1], ['te!', 'te', 74, 1.5], ['', null, null, 1],
    ] },
    { bar: 28, syl: [
      ['Cen', 'cen', 73, 0.5], ['tot', 'tot', 73, 0.5], ['tan', 'tan', 76, 1], ['ta! ', 'ta', 73, 1], ['', null, null, 1],
      ['Pom, ', 'pom', 71, 0.5], ['', null, null, 0.5], ['pom, ', 'pom', 71, 0.5], ['', null, null, 0.5], ['POM!', 'pom', 76, 1.5], ['', null, null, 0.5],
    ] },
  ],
}
