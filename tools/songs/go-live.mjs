// Go-live: a transport travels from development to quality to production, the
// client calls, and it goes live. In G major, driving; the first song whose
// words need the advanced voice (go, live, va, DEV, produzione).
// Same 16-bar form (see tools/synth.mjs).
export default {
  bpm: 84,
  seed: 20261111,
  // The sound profiles it is played in, and the voice styles of each with its audio file (see tools/render.mjs).
  audio: { pop: { classico: 'audio/go-live.m4a', avanzato: 'audio/go-live-avanzato.m4a' } },
  // The voice at the level of the other songs, in both styles (see tools/synth.mjs).
  voiceRms: 0.13,
  // name: [bass root (MIDI), chord intervals]
  chords: {
    G: [43, [0, 4, 7]],
    D: [38, [0, 4, 7]],
    Em: [40, [0, 3, 7]],
    C: [48, [0, 4, 7]],
    Cmaj7: [48, [0, 4, 7, 11]],
    Am7: [45, [0, 3, 7, 10]],
  },
  // One entry per bar: [chord, beats] pairs.
  bars: [
    [['Em', 4]], [['C', 2], ['D', 2]],
    [['G', 4]], [['D', 4]], [['Em', 4]], [['C', 4]],
    [['Am7', 4]], [['D', 4]], [['G', 4]], [['D', 4]],
    [['C', 4]], [['D', 4]], [['Em', 2], ['D', 2]], [['G', 4]],
    [['Cmaj7', 4]], [['G', 4]],
  ],
  // [display, sung spelling, midi | midi[], beats | beats[]]; a null spelling is a rest
  lines: [
    { bar: 2, syl: [
      ['Go-', 'go', 71, 0.5], ['li', 'li', 67, 0.5], ['ve, ', 've', 74, 1], ['go-', 'go', 71, 0.5], ['li', 'li', 67, 0.5], ['ve, ', 've', 74, 1],
      ['sta', 'sta', 74, 0.5], ['not', 'no', 72, 0.5], ['te ', 'te', 71, 0.5], ['si ', 'si', 66, 0.5], ['va', 'va', 69, 1.5], ['', null, null, 0.5],
    ] },
    { bar: 4, syl: [
      ['dal ', 'dal', 67, 0.5], ['DEV ', 'dev', 71, 1], ['al ', 'al', 67, 0.5], ['QAS ', 'kas', 71, 1], ['e ', 'e', 72, 0.5], ['poi ', 'poi', 71, 0.5],
      ['pro', 'pro', 72, 0.5], ['du', 'du', 71, 0.5], ['zio', 'zio', 67, 0.5], ['ne', 'ne', 64, 1.5], ['', null, null, 1],
    ] },
    { bar: 6, syl: [
      ['il ', 'il', 64, 0.5], ['cli', 'cli', 64, 0.5], ['en', 'en', 69, 0.5], ['te ', 'te', 72, 0.5], ['al ', 'al', 69, 0.5], ['te', 'te', 69, 0.5], ['le', 'le', 72, 0.5], ['fo', 'fo', 71, 0.5],
      ['no: ', 'no', 69, 0.5], ['al', 'al', 69, 0.5], ['lo', 'lo', 72, 0.5], ['ra, ', 'ra', 74, 0.5], ['va?', 'va', [69, 74], [1, 1]],
    ] },
    { bar: 8, syl: [
      ['e ', 'e', 71, 0.5], ['can', 'can', 74, 1], ['to, ', 'to', 71, 0.5], ['e ', 'e', 71, 0.5], ['can', 'can', 74, 1], ['to, ', 'to', 71, 0.5],
      ['tut', 'tu', 71, 0.5], ['to ', 'to', 72, 0.5], ['ver', 'ver', 74, 1], ['de ', 'de', 72, 0.5], ['or', 'or', 71, 0.5], ['mai', 'mai', 69, 1],
    ] },
    { bar: 10, syl: [
      ['Go-', 'go', 76, 0.5], ['li', 'li', 72, 0.5], ['ve! ', 've', 76, 1.5], ['', null, null, 0.5], ['Go-', 'go', 76, 0.5], ['li', 'li', 72, 0.5],
      ['ve! ', 've', 74, 1.5], ['', null, null, 0.5], ['È ', 'e', 72, 0.5], ['an', 'an', 74, 0.5], ['da', 'da', 72, 0.5], ['ta!', 'ta', 71, 0.5],
    ] },
    { bar: 12, syl: [
      ['e ', 'e', 71, 0.5], ['do', 'do', 71, 0.5], ['ma', 'ma', 72, 0.5], ['ni, ', 'ni', 67, 0.5], ['caf', 'ca', 69, 1], ['fè ', 'fe', 66, 1],
      ['con ', 'con', 67, 0.5], ['te', 'te', [74, 71], [0.5, 3]],
    ] },
  ],
}
