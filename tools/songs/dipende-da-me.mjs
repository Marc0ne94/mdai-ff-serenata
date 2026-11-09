// Dipende da me: the first song of the Odissea collection taken from a
// philosopher. Its thought is Epictetus', the opening of his Manual
// (Enchiridion, chapter 1): some things are in our power, others are not
// (in Leopardi's Italian: «Le cose sono di due maniere; alcune in potere
// nostro, altre no»). The words are a paraphrase in plain Italian; the wind
// and the sail are an image of this song's, not of Epictetus. In our power,
// for him, is first our judgment: «I choose the thought» in the fourth line.
// A minor that opens into C major at the finale, as the storm passes, over a
// drone of A and E; played by the ancient orchestra. Same 16-bar form (see tools/synth.mjs).
export default {
  bpm: 80,
  seed: 20261113,
  // The sound profiles it is played in, and the voice styles of each with its audio file (see tools/render.mjs).
  audio: {
    plettro: { classico: 'audio/dipende-da-me.m4a', avanzato: 'audio/dipende-da-me-avanzato.m4a' },
    dita: { classico: 'audio/dipende-da-me-dita.m4a', avanzato: 'audio/dipende-da-me-dita-avanzato.m4a' },
  },
  // The voice at the level of the other songs, in both styles, and the whole song
  // at the level of their verses in every profile (see tools/synth.mjs).
  voiceRms: 0.13,
  masterLevel: -17,
  // Held under the whole song: A and the E above it.
  drone: [45, 52],
  // The reed's own tune, before the voice (bars 0-1) and after it (bars 14-15): [midi, beats].
  reed: {
    intro: [[69, 0.5], [72, 0.5], [71, 0.5], [69, 0.5], [64, 1], [65, 0.5], [64, 0.5], [62, 0.5], [64, 0.5], [65, 0.5], [67, 0.5], [64, 2]],
    outro: [[74, 1], [72, 0.5], [71, 0.5], [67, 1], [69, 0.5], [71, 0.5], [72, 1.5], [67, 0.5], [72, 2]],
  },
  // name: [bass root (MIDI), chord intervals]
  chords: {
    Am: [45, [0, 3, 7]],
    G: [43, [0, 4, 7]],
    F: [41, [0, 4, 7]],
    E: [40, [0, 4, 7]],
    C: [48, [0, 4, 7]],
  },
  // One entry per bar: [chord, beats] pairs.
  bars: [
    [['Am', 4]], [['Am', 4]],
    [['Am', 4]], [['G', 4]], [['F', 4]], [['E', 4]],
    [['Am', 4]], [['G', 4]], [['F', 4]], [['C', 4]],
    [['C', 2], ['G', 2]], [['Am', 2], ['F', 2]], [['F', 4]], [['C', 4]],
    [['G', 4]], [['C', 4]],
  ],
  // [display, sung spelling, midi | midi[], beats | beats[]]; a null spelling is a rest
  lines: [
    { bar: 2, syl: [
      ['Cer', 'cer', 64, 0.5], ['te ', 'te', 64, 0.5], ['co', 'co', 69, 1], ['se ', 'se', 67, 0.5], ['di', 'di', 64, 0.5], ['pen', 'pen', 65, 0.5], ['do', 'do', 64, 0.5],
      ['no ', 'no', 62, 0.5], ['da ', 'da', 67, 0.5], ['me', 'me', [71, 67], [2, 0.5]], ['', null, null, 0.5],
    ] },
    { bar: 4, syl: [
      ['al', 'al', 69, 0.5], ['tre ', 'tre', 72, 0.5], ['no, ', 'no', 69, 1], ['e ', 'e', 65, 0.5], ['va ', 'va', 69, 0.5], ['be', 'be', 72, 0.5], ['ne ', 'ne', 69, 0.5],
      ['co', 'co', 68, 0.5], ['sì', 'si', 64, 2.5], ['', null, null, 1],
    ] },
    { bar: 6, syl: [
      ['il ', 'il', 64, 0.5], ['ven', 'ven', 69, 0.5], ['to ', 'to', 72, 1], ['non ', 'non', 71, 0.5], ['lo ', 'lo', 69, 0.5], ['scel', 'scel', 67, 0.5], ['go ', 'go', 69, 0.5],
      ['i', 'i', 67, 0.5], ['o', 'o', [71, 67], [1.5, 1]], ['', null, null, 1],
    ] },
    { bar: 8, syl: [
      ['scel', 'scel', 69, 0.5], ['go il ', 'goil', 72, 0.5], ['pen', 'pen', 72, 1], ['sie', 'sie', 69, 0.5], ['ro, ', 'ro', 65, 1.5],
      ['scel', 'scel', 72, 0.5], ['go ', 'go', 71, 0.5], ['la ', 'la', 67, 0.5], ['ve', 've', 72, 0.5], ['la', 'la', 72, 2],
    ] },
    { bar: 10, syl: [
      ['Di', 'di', 67, 0.5], ['pen', 'pen', 72, 0.5], ['de ', 'de', 72, 0.5], ['da ', 'da', 71, 0.5], ['me! ', 'me', 74, 1.5], ['', null, null, 0.5],
      ['Il ', 'il', 67, 0.5], ['re', 're', 72, 0.5], ['sto ', 'sto', 76, 1], ['no!', 'no', [72, 69], [1.5, 0.5]],
    ] },
    { bar: 12, syl: [
      ['e ', 'e', 69, 0.5], ['la', 'la', 72, 0.5], ['scio ', 'scio', 72, 0.5], ['il ', 'il', 69, 0.5], ['ven', 'ven', 72, 1], ['to ', 'to', 69, 1],
      ['al ', 'al', 67, 0.5], ['ven', 'ven', 72, 0.5], ['to', 'to', [64, 60], [1, 2]],
    ] },
  ],
}
