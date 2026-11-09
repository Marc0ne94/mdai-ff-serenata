// So di non sapere: Socrates and the oracle of Delphi, as Plato tells it in the
// Apology of Socrates (21a-d): Chaerephon asked at Delphi whether anyone was
// wiser than Socrates, and the oracle said no one; Socrates, questioning the
// wise, found himself wiser in this alone, that what he does not know he does
// not think he knows. The title is the well-known later summary of that
// passage, not Plato's words; the song's words are a paraphrase in plain Italian.
// Its fourth line is his way of searching: asking.
// E phrygian, with its falling F to E cadence, over a drone of E and B; played
// by the ancient orchestra. Same 16-bar form (see tools/synth.mjs).
export default {
  bpm: 76,
  seed: 20261115,
  // The sound profiles it is played in, and the voice styles of each with its audio file (see tools/render.mjs).
  audio: {
    plettro: { classico: 'audio/so-di-non-sapere.m4a', avanzato: 'audio/so-di-non-sapere-avanzato.m4a' },
    dita: { classico: 'audio/so-di-non-sapere-dita.m4a', avanzato: 'audio/so-di-non-sapere-dita-avanzato.m4a' },
  },
  // The voice at the level of the other songs, and the whole song at the level
  // of their verses in every profile (see tools/synth.mjs).
  voiceRms: 0.13,
  masterLevel: -17,
  // Held under the whole song: E and the B above it.
  drone: [40, 47],
  // The reed's own tune, before the voice (bars 0-1) and after it (bars 14-15): [midi, beats].
  reed: {
    intro: [[64, 0.5], [65, 0.5], [67, 1], [69, 0.5], [67, 0.5], [65, 1], [64, 1], [65, 0.5], [64, 0.5], [64, 2]],
    outro: [[72, 1], [71, 0.5], [69, 0.5], [67, 1], [65, 1], [64, 1.5], [65, 0.5], [64, 2]],
  },
  // name: [bass root (MIDI), chord intervals]
  chords: {
    Em: [40, [0, 3, 7]],
    F: [41, [0, 4, 7]],
    G: [43, [0, 4, 7]],
    Am: [45, [0, 3, 7]],
    Dm: [38, [0, 3, 7]],
  },
  // One entry per bar: [chord, beats] pairs.
  bars: [
    [['Em', 4]], [['F', 2], ['Em', 2]],
    [['Em', 4]], [['F', 4]], [['G', 4]], [['Am', 4]],
    [['Dm', 4]], [['Em', 4]], [['F', 4]], [['G', 4]],
    [['Am', 2], ['G', 2]], [['F', 2], ['Em', 2]], [['Dm', 2], ['F', 2]], [['Em', 4]],
    [['F', 4]], [['Em', 4]],
  ],
  // [display, sung spelling, midi | midi[], beats | beats[]]; a null spelling is a rest
  lines: [
    { bar: 2, syl: [
      ['Chie', 'chie', 67, 1], ['se', 'se', 64, 0.5], ['ro a ', 'ro', 67, 0.5], ['Del', 'del', 71, 1], ['fi: ', 'fi', 67, 1],
      ['chi ', 'chi', 65, 0.5], ['è ', 'e', 69, 0.5], ['più ', 'piu', 72, 0.5], ['sag', 'sa', 71, 1], ['gio?', 'gio', 69, 1.5],
    ] },
    { bar: 4, syl: [
      ['Nes', 'ne', 71, 0.5], ['su', 'su', 74, 1], ['no, ', 'no', 71, 1], ['ri', 'ri', 64, 0.5], ['spo', 'spo', 71, 0.5], ['se ', 'se', 69, 0.5],
      ['il ', 'il', 64, 0.5], ['di', 'di', 64, 0.5], ['o', 'o', 69, 2], ['', null, null, 1],
    ] },
    { bar: 6, syl: [
      ['I', 'io', 65, 0.5], ['o ', 'non', 69, 0.5], ['so, ', 'so', 72, 1], ['e ', 'e', 69, 0.5], ['non ', 'non', 69, 0.5], ['cre', 'cre', 72, 0.5], ['do ', 'do', 69, 0.5],
      ['di ', 'di', 67, 0.5], ['sa', 'sa', 71, 0.5], ['pe', 'pe', 72, 0.5], ['re', 're', 71, 1.5], ['', null, null, 1],
    ] },
    { bar: 8, syl: [
      ['do', 'do', 69, 0.5], ['man', 'man', 72, 1], ['do, ', 'do', 69, 0.5], ['do', 'do', 69, 0.5], ['man', 'man', 72, 1], ['do, ', 'do', 69, 0.5],
      ['e ', 'e', 71, 0.5], ['cer', 'cer', 74, 0.5], ['co an', 'coan', 71, 0.5], ['co', 'co', 67, 0.5], ['ra', 'ra', 71, 2],
    ] },
    { bar: 10, syl: [
      ['So ', 'so', 76, 0.5], ['di ', 'di', 69, 0.5], ['non ', 'non', 72, 0.5], ['sa', 'sa', 74, 0.5], ['pe', 'pe', 74, 0.5], ['re! ', 're', 71, 1.5],
      ['So ', 'so', 72, 0.5], ['di ', 'di', 69, 0.5], ['non ', 'non', 69, 0.5], ['sa', 'sa', 72, 0.5], ['pe', 'pe', 71, 0.5], ['re!', 're', 64, 1.5],
    ] },
    { bar: 12, syl: [
      ['è ', 'e', 69, 0.5], ['la ', 'la', 69, 0.5], ['mia ', 'mia', 72, 1], ['sag', 'sa', 72, 0.5], ['gez', 'ge', 69, 0.5], ['za, ', 'za', 65, 1],
      ['per ', 'per', 67, 0.5], ['te', 'te', [71, 64], [1.5, 2]],
    ] },
  ],
}
