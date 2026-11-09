// Cutover: dark hardcore at 190 for the night a system goes live. Three in the
// morning, the system down, a thousand transports in the queue; the imports
// fail (RC 8, errors), and fail again; all or nothing, and the drop: «Cutover!
// Va' in produzione!», RC 0, all green. A breakdown without the kick, the
// client waiting and the coffee gone, then the chorus again and a last drop a
// tone higher, live at dawn: «buongiorno».
// In D minor, the last drop in E minor. Written at 95 and played in double time
// by the rave band (see tools/synth.mjs). Sung only in the advanced voice: its
// words need v, b, g and z (cutover, produzione, buongiorno).
export default {
  bpm: 95,
  doubleTime: true,
  seed: 20261112,
  audio: { rave: { avanzato: 'audio/cutover.m4a' } },
  // The voice a little above the other songs, to ride over the kick, and the
  // whole song at their level (see tools/synth.mjs).
  voiceRms: 0.15,
  masterLevel: -17,
  // The kick from the first bar, the acid line with the first words, the hats
  // from the second line, stabs and claps from the third.
  build: { heartbeat: 0, bass: 2, drums: 4, pad: 6 },
  // The verse; all or nothing (a two-bar break); the chorus; a breakdown; the
  // chorus again; the last drop.
  form: [
    ['intro', 2], ['verse', 8], ['break', 2], ['drop', 4],
    ['break', 4], ['drop', 4], ['drop', 4], ['outro', 2],
  ],
  // name: [bass root (MIDI), chord intervals]
  chords: {
    Dm: [38, [0, 3, 7]],
    Bb: [46, [0, 4, 7]],
    F: [41, [0, 4, 7]],
    C: [48, [0, 4, 7]],
    Gm: [43, [0, 3, 7]],
    A7: [45, [0, 4, 7, 10]],
    B7: [47, [0, 4, 7, 10]],
    Em: [40, [0, 3, 7]],
    G: [43, [0, 4, 7]],
    D: [50, [0, 4, 7]],
  },
  // One entry per bar: [chord, beats] pairs.
  bars: [
    [['Dm', 4]], [['Bb', 2], ['C', 2]],
    [['Dm', 4]], [['Bb', 4]], [['F', 4]], [['C', 4]], [['Dm', 4]], [['Bb', 4]], [['Gm', 4]], [['A7', 4]],
    [['Dm', 4]], [['A7', 4]],
    [['Dm', 4]], [['Bb', 4]], [['F', 4]], [['C', 4]],
    [['Bb', 4]], [['C', 4]], [['Dm', 4]], [['A7', 4]],
    [['Dm', 4]], [['Bb', 4]], [['F', 4]], [['C', 2], ['B7', 2]],
    [['Em', 4]], [['C', 4]], [['G', 4]], [['D', 4]],
    [['C', 2], ['D', 2]], [['Em', 4]],
  ],
  // [display, sung spelling, midi | midi[], beats | beats[]]; a null spelling is a rest
  lines: [
    // The verse: the night, the queue, the errors.
    { bar: 2, syl: [
      ['So', 'so', 62, 0.5], ['no ', 'no', 65, 0.5], ['le ', 'le', 65, 0.5], ['tre, ', 'tre', 69, 1], ['', null, null, 0.5],
      ['il ', 'il', 62, 0.5], ['si', 'si', 64, 0.5], ['ste', 'ste', 65, 0.5], ['ma ', 'ma', 65, 0.5], ['è ', 'e', 67, 0.5], ['fer', 'fer', 69, 0.5],
      ['mo, ', 'mo', 65, 1.5], ['', null, null, 0.5],
    ] },
    { bar: 4, syl: [
      ['mil', 'mil', 65, 0.5], ['le ', 'le', 65, 0.5], ['tra', 'tra', 69, 0.5], ['spor', 'spor', 69, 0.5], ['ti ', 'ti', 69, 0.5], ['in ', 'in', 69, 0.5],
      ['co', 'co', 67, 0.5], ['da, ', 'da', 65, 1], ['', null, null, 0.5],
      ['u', 'u', 64, 0.5], ['no ', 'no', 67, 0.5], ['per ', 'per', 67, 0.5], ['u', 'u', 64, 0.5], ['no, ', 'no', 67, 1],
    ] },
    { bar: 6, syl: [
      ['im', 'im', 69, 0.5], ['port, ', 'port', 69, 1], ['im', 'im', 69, 0.5], ['port… ', 'port', 72, 1], ['', null, null, 1],
      ['er', 'er', 70, 0.5], ['re ', 're', 70, 0.5], ['ci ', 'ci', 65, 0.5], ['ot', 'ot', 65, 0.5], ['to!', 'to', 62, 1.5], ['', null, null, 0.5],
    ] },
    { bar: 8, syl: [
      ['Ri', 'ri', 64, 0.5], ['pro', 'pro', 70, 0.5], ['vo, ', 'vo', 67, 1], ['ri', 'ri', 64, 0.5], ['pro', 'pro', 70, 0.5], ['vo, ', 'vo', 74, 1],
      ['an', 'an', 73, 0.5], ['co', 'co', 73, 0.5], ['ra ', 'ra', 69, 0.5], ['u', 'u', 69, 0.5], ['na ', 'na', 67, 0.5], ['vol', 'vol', 69, 0.5], ['ta… ', 'ta', 73, 1],
    ] },
    // All or nothing: the kick out, a roll.
    { bar: 10, syl: [
      ['Tut', 'tut', 62, 0.5], ['to o ', 'to', 65, 0.5], ['nien', 'nien', 69, 1], ['te… ', 'te', 65, 1], ['', null, null, 1],
      ['a', 'a', 69, 0.5], ['des', 'des', 73, 0.5], ['so!', 'so', [73, 76], [1.5, 1]], ['', null, null, 0.5],
    ] },
    // The chorus.
    { bar: 12, syl: [
      ['Cut', 'cat', 74, 0.5], ['o', 'o', 72, 0.5], ['ver! ', 'ver', 69, 1], ['Cut', 'cat', 74, 0.5], ['o', 'o', 72, 0.5], ['ver! ', 'ver', 74, 1],
      ["Va' ", 'va', 74, 0.5], ['in ', 'in', 74, 0.5], ['pro', 'pro', 74, 0.5], ['du', 'du', 72, 0.5], ['zio', 'zio', 70, 0.5], ['ne!', 'ne', 74, 1.5],
    ] },
    { bar: 14, syl: [
      ['Er', 'er', 69, 0.5], ['re ', 're', 69, 0.5], ['ci ', 'ci', 65, 0.5], ['ze', 'ze', 72, 0.5], ['ro, ', 'ro', 72, 1], ['tut', 'tut', 69, 0.5], ['to ', 'to', 69, 0.5],
      ['ver', 'ver', 72, 0.5], ['de: ', 'de', 72, 1], ['si ', 'si', 67, 0.5], ['va!', 'va', 72, 1.5], ['', null, null, 0.5],
    ] },
    // The breakdown: no kick, the client waiting.
    { bar: 16, syl: [
      ['Il ', 'il', 62, 0.5], ['clien', 'clien', 65, 1], ['te a', 'te', 65, 0.5], ['spet', 'spet', 65, 0.5], ['ta, ', 'ta', 70, 1.5],
      ['il ', 'il', 67, 0.5], ['caf', 'caf', 67, 0.5], ['fè ', 'fe', 67, 0.5], ['è ', 'e', 64, 0.5], ['fi', 'fi', 64, 0.5], ['ni', 'ni', 64, 0.5], ['to… ', 'to', 64, 1],
    ] },
    { bar: 18, syl: [
      ['man', 'man', 62, 0.5], ['ca ', 'ca', 62, 0.5], ['po', 'po', 65, 0.5], ['co, ', 'co', 65, 0.5], ['man', 'man', 69, 0.5], ['ca ', 'ca', 69, 0.5], ['po', 'po', 72, 0.5], ['co… ', 'co', 72, 0.5],
      ['a', 'a', 69, 0.5], ['des', 'des', 73, 0.5], ['so!', 'so', [73, 76], [1.5, 1]], ['', null, null, 0.5],
    ] },
    // The chorus again, turning at its end towards the last key.
    { bar: 20, syl: [
      ['Cut', 'cat', 74, 0.5], ['o', 'o', 72, 0.5], ['ver! ', 'ver', 69, 1], ['Cut', 'cat', 74, 0.5], ['o', 'o', 72, 0.5], ['ver! ', 'ver', 74, 1],
      ["Va' ", 'va', 74, 0.5], ['in ', 'in', 74, 0.5], ['pro', 'pro', 74, 0.5], ['du', 'du', 72, 0.5], ['zio', 'zio', 70, 0.5], ['ne!', 'ne', 74, 1.5],
    ] },
    { bar: 22, syl: [
      ['Er', 'er', 69, 0.5], ['re ', 're', 69, 0.5], ['ci ', 'ci', 65, 0.5], ['ze', 'ze', 72, 0.5], ['ro, ', 'ro', 72, 1], ['tut', 'tut', 69, 0.5], ['to ', 'to', 69, 0.5],
      ['ver', 'ver', 72, 0.5], ['de: ', 'de', 72, 1], ['si ', 'si', 67, 0.5], ['va!', 'va', 71, 1.5], ['', null, null, 0.5],
    ] },
    // The last drop, a tone higher, at dawn.
    { bar: 24, syl: [
      ['Cut', 'cat', 76, 0.5], ['o', 'o', 74, 0.5], ['ver! ', 'ver', 71, 1], ['Cut', 'cat', 76, 0.5], ['o', 'o', 74, 0.5], ['ver! ', 'ver', 76, 1],
      ['Sia', 'sia', 72, 0.5], ['mo ', 'mo', 76, 0.5], ['live!', 'laiv', 76, 2], ['', null, null, 1],
    ] },
    { bar: 26, syl: [
      ['Si', 'si', 67, 0.5], ['ste', 'ste', 71, 0.5], ['ma ', 'ma', 74, 1], ['ver', 'ver', 74, 0.5], ['de: ', 'de', 71, 1.5],
      ['buon', 'buon', 74, 0.5], ['gior', 'gior', 76, 0.5], ['no!', 'no', 74, 2.5], ['', null, null, 0.5],
    ] },
  ],
}
