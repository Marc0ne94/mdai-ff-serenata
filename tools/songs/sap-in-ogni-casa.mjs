// SAP in ogni casa: the third song of MDO, rock in the manner of heavy metal,
// on Marco's own idea: SAP is already in almost every company, so why not in
// every home? The first verse counts where it is (the factory, the bank,
// orders, invoices, the warehouse) and finds only chaos at home; the refrain
// chants «SAP AT HOME!» and brings it in: the fridge runs its MRP, the
// shopping waits for approval. The second verse fills the house (the washing
// machine's workflow, the mother-in-law approving in Fiori, the mortgage
// closing at month end, the dog's go-live), the second refrain puts the
// pocket money on the payroll and the whole house on S/4; then a guitar
// solo, and a last refrain that ends on the call. Marco's call, «Clauddino
// babyyyy… EMMEDIOOOOO!», opens it and closes it. Its words, tune, riff and
// solo are its own.
// D minor, at 152, the guitars tuned down to D: the riff gallops on D and
// climbs F, G, F; the refrain falls D, C, B flat, A under the chant. The
// voice stays at or under G4 on every i, where it keeps its colour. Played
// by the metal orchestra (see tools/synth.mjs): the band headbangs to it in
// the drops.
// Sung only in the advanced voice: its words need b, g, v and z (babyyyy,
// già, lavatrice, azienda).
export default {
  bpm: 152,
  seed: 20261125,
  audio: { metal: { avanzato: 'audio/sap-in-ogni-casa.m4a' } },
  // The voice above the other songs, to ride over the guitars, and the whole
  // song at their level (see tools/synth.mjs).
  voiceRms: 0.16,
  masterLevel: -17,
  // The riff alone for two bars, the bass with it for two more, the drums with the call.
  build: { bass: 2, drums: 4 },
  form: [['intro', 4], ['verse', 10], ['break', 2], ['drop', 8], ['verse', 8], ['break', 2], ['drop', 8], ['verse', 4], ['drop', 4], ['outro', 2]],
  // name: [bass root (MIDI), chord intervals]: power chords, root, fifth and
  // octave, D on the dropped low string.
  chords: {
    D5: [38, [0, 7, 12]],
    F5: [41, [0, 7, 12]],
    G5: [43, [0, 7, 12]],
    A5: [45, [0, 7, 12]],
    Bb5: [46, [0, 7, 12]],
    C5: [48, [0, 7, 12]],
  },
  // One entry per bar: [chord, beats] pairs.
  bars: [
    // The riff: alone, then with the bass.
    [['D5', 2.5], ['F5', 0.5], ['G5', 0.5], ['F5', 0.5]], [['D5', 2], ['C5', 1], ['A5', 1]],
    [['D5', 2.5], ['F5', 0.5], ['G5', 0.5], ['F5', 0.5]], [['D5', 2], ['C5', 1], ['A5', 1]],
    // The call, with the drums.
    [['D5', 2.5], ['F5', 0.5], ['G5', 0.5], ['F5', 0.5]], [['D5', 2], ['C5', 1], ['A5', 1]],
    // The first verse.
    [['D5', 2.5], ['F5', 0.5], ['G5', 0.5], ['F5', 0.5]], [['D5', 2], ['C5', 1], ['A5', 1]],
    [['D5', 2.5], ['F5', 0.5], ['G5', 0.5], ['F5', 0.5]], [['D5', 2], ['C5', 1], ['A5', 1]],
    [['D5', 2.5], ['F5', 0.5], ['G5', 0.5], ['F5', 0.5]], [['D5', 2], ['C5', 1], ['A5', 1]],
    [['D5', 2.5], ['F5', 0.5], ['G5', 0.5], ['F5', 0.5]], [['D5', 2], ['C5', 1], ['A5', 1]],
    // Perché no?
    [['Bb5', 4]], [['C5', 4]],
    // The refrain.
    [['D5', 4]], [['C5', 4]], [['Bb5', 4]], [['A5', 4]], [['D5', 4]], [['C5', 4]], [['Bb5', 4]], [['A5', 4]],
    // The second verse.
    [['D5', 2.5], ['F5', 0.5], ['G5', 0.5], ['F5', 0.5]], [['D5', 2], ['C5', 1], ['A5', 1]],
    [['D5', 2.5], ['F5', 0.5], ['G5', 0.5], ['F5', 0.5]], [['D5', 2], ['C5', 1], ['A5', 1]],
    [['D5', 2.5], ['F5', 0.5], ['G5', 0.5], ['F5', 0.5]], [['D5', 2], ['C5', 1], ['A5', 1]],
    [['D5', 2.5], ['F5', 0.5], ['G5', 0.5], ['F5', 0.5]], [['D5', 2], ['C5', 1], ['A5', 1]],
    // Perché no?
    [['Bb5', 4]], [['C5', 4]],
    // The second refrain.
    [['D5', 4]], [['C5', 4]], [['Bb5', 4]], [['A5', 4]], [['D5', 4]], [['C5', 4]], [['Bb5', 4]], [['A5', 4]],
    // The solo.
    [['D5', 4]], [['C5', 4]], [['Bb5', 4]], [['A5', 4]],
    // The last refrain, and the call.
    [['D5', 4]], [['C5', 4]], [['Bb5', 4]], [['A5', 4]],
    // The last hit.
    [['D5', 4]], [['D5', 4]],
  ],
  // The lead guitar's solo, from the first bar of the solo: [midi, beats], and
  // a third number to bend up into the note by that many semitones.
  solo: [
    [74, 0.5], [77, 0.5], [79, 1], [81, 0.5], [79, 0.5], [77, 0.5], [74, 0.5],
    [72, 0.25], [74, 0.25], [76, 0.25], [77, 0.25], [79, 1], [76, 0.5], [72, 0.5], [76, 1],
    [77, 0.5], [74, 0.5], [70, 0.5], [74, 0.5], [77, 1], [82, 1, 2],
    [81, 0.25], [79, 0.25], [77, 0.25], [76, 0.25], [73, 1], [76, 1], [81, 1],
  ],
  // [display, sung spelling, midi | midi[], beats | beats[]]; a null spelling is a rest
  lines: [
    // The call.
    { bar: 4, syl: [
      ['Clau', 'clau', 69, 0.5], ['ddi', 'di', 65, 0.5], ['no ', 'no', 65, 0.5], ['ba', 'bei', 67, 0.5], ['byyyy… ', 'bi', [65, 62], [1, 1]],
      ['EM', 'em', 67, 0.5], ['ME', 'me', 69, 0.5], ['DI', 'di', 65, 0.5], ['OOOOO! ', 'o', [74, 72], [2, 0.5]],
    ] },
    // The first verse.
    { bar: 6, syl: [
      ['In ', 'in', 62, 0.5], ['o', 'o', 62, 0.5], ['gni a', 'gnia', 65, 0.5], ['zien', 'zien', 65, 0.5], ['da ', 'da', 67, 0.5], ["c'è ", 'ce', 69, 0.5], ['già ', 'gia', 67, 0.5],
      ['SAP: ', 'sap', [65, 62], [1, 1]], ['', null, null, 2.5],
    ] },
    { bar: 8, syl: [
      ['dal', 'dal', 62, 0.5], ['la ', 'la', 62, 0.5], ['fab', 'fab', 65, 0.5], ['bri', 'bri', 65, 0.5], ['ca ', 'ca', 62, 0.5],
      ['al', 'al', 65, 0.5], ['la ', 'la', 67, 0.5], ['ban', 'ban', 69, 0.5], ['ca, ', 'ca', 67, 0.5], ['è ', 'e', 65, 0.5], ['lì: ', 'li', 62, 1.5], ['', null, null, 1.5],
    ] },
    { bar: 10, syl: [
      ['or', 'or', 65, 0.5], ['di', 'di', 65, 0.5], ['ni, ', 'ni', 62, 1], ['fat', 'fat', 65, 0.5], ['tu', 'tu', 67, 0.5], ['re, ', 're', 65, 1],
      ['ma', 'ma', 67, 0.5], ['gaz', 'gaz', 69, 0.5], ['zi', 'zi', 67, 0.5], ['no, ', 'no', 65, 1.5], ['', null, null, 1],
    ] },
    { bar: 12, syl: [
      ['e a ', 'e', 62, 0.5], ['ca', 'ca', 65, 0.5], ['sa ', 'sa', 65, 0.5], ['mia… ', 'mia', 69, 1.5],
      ['so', 'so', 69, 0.5], ['lo il ', 'loil', 67, 0.5], ['ca', 'ca', 70, 1], ['os! ', 'os', 69, 1.5], ['', null, null, 1.5],
    ] },
    // Perché no?
    { bar: 14, syl: [
      ['Per', 'per', 69, 0.5], ['ché ', 'che', 69, 0.5], ['non ', 'non', 70, 0.5], ['a ', 'a', 69, 0.5], ['ca', 'ca', 67, 0.5], ['sa? ', 'sa', 65, 1.5],
      ['Per', 'per', 72, 0.5], ['ché ', 'che', 72, 0.5], ['no?! ', 'no', [74, 76], [1.5, 1.5]],
    ] },
    // The refrain.
    { bar: 16, syl: [
      ['SAP ', 'sap', 74, 1], ['AT ', 'et', 74, 0.5], ['HOME! ', 'om', 69, 1.5], ['', null, null, 1],
      ['SAP ', 'sap', 72, 1], ['AT ', 'et', 72, 0.5], ['HOME! ', 'om', 67, 1.5], ['', null, null, 1],
    ] },
    { bar: 18, syl: [
      ['Il ', 'il', 65, 0.5], ['fri', 'fri', 65, 0.5], ['go ', 'go', 67, 0.5], ['lan', 'lan', 69, 0.5], ['cia ', 'cia', 70, 1],
      ["l'M", 'lem', 69, 0.5], ['', 'me', 67, 0.5], ['R', 'er', 69, 0.5], ['', 're', 67, 0.5], ['P! ', 'pi', [65, 64], [1, 1]], ['', null, null, 1],
    ] },
    { bar: 20, syl: [
      ['SAP ', 'sap', 74, 1], ['AT ', 'et', 74, 0.5], ['HOME! ', 'om', 69, 1.5], ['', null, null, 1],
      ['SAP ', 'sap', 72, 1], ['AT ', 'et', 72, 0.5], ['HOME! ', 'om', 67, 1.5], ['', null, null, 1],
    ] },
    { bar: 22, syl: [
      ['La ', 'la', 65, 0.5], ['spe', 'spe', 67, 0.5], ['sa ', 'sa', 69, 0.5], ['va in ', 'vain', 70, 0.5], ['ap', 'ap', 69, 0.5], ['pro', 'pro', 70, 0.5], ['va', 'va', 72, 0.5],
      ['zio', 'zio', 74, 1], ['ne! ', 'ne', [73, 69], [1.5, 1.5]], ['', null, null, 0.5],
    ] },
    // The second verse.
    { bar: 24, syl: [
      ['La ', 'la', 62, 0.5], ['la', 'la', 62, 0.5], ['va', 'va', 65, 0.5], ['tri', 'tri', 65, 0.5], ['ce ', 'ce', 67, 0.5], ['ha il ', 'ail', 67, 0.5], ['suo ', 'suo', 69, 0.5],
      ['work', 'uork', 67, 0.5], ['flow, ', 'flou', 65, 1.5], ['', null, null, 2.5],
    ] },
    { bar: 26, syl: [
      ['la ', 'la', 62, 0.5], ['suo', 'suo', 65, 0.5], ['ce', 'ce', 65, 0.5], ['ra ', 'ra', 62, 0.5], ['ap', 'ap', 65, 0.5], ['pro', 'pro', 67, 0.5], ['va ', 'va', 69, 0.5],
      ['su ', 'su', 67, 0.5], ['Fio', 'fio', 69, 1], ['ri, ', 'ri', 65, 1], ['', null, null, 2],
    ] },
    { bar: 28, syl: [
      ['il ', 'il', 62, 0.5], ['mu', 'mu', 65, 0.5], ['tuo ', 'tuo', 65, 0.5], ['chiu', 'chiu', 67, 0.5], ['de a ', 'dea', 65, 0.5], ['fi', 'fi', 67, 0.5], ['ne ', 'ne', 69, 0.5],
      ['me', 'me', 70, 0.5], ['se, ', 'se', 69, 1.5], ['', null, null, 2.5],
    ] },
    { bar: 30, syl: [
      ['e il ', 'eil', 65, 0.5], ['ca', 'ca', 67, 0.5], ['ne ', 'ne', 69, 0.5], ['va in ', 'vain', 70, 1], ['go-', 'go', 72, 1], ['live! ', 'laiv', [74, 72], [1.5, 1]], ['', null, null, 2],
    ] },
    // Perché no?
    { bar: 32, syl: [
      ['Per', 'per', 69, 0.5], ['ché ', 'che', 69, 0.5], ['non ', 'non', 70, 0.5], ['a ', 'a', 69, 0.5], ['ca', 'ca', 67, 0.5], ['sa? ', 'sa', 65, 1.5],
      ['Per', 'per', 72, 0.5], ['ché ', 'che', 72, 0.5], ['no?! ', 'no', [74, 76], [1.5, 1.5]],
    ] },
    // The second refrain.
    { bar: 34, syl: [
      ['SAP ', 'sap', 74, 1], ['AT ', 'et', 74, 0.5], ['HOME! ', 'om', 69, 1.5], ['', null, null, 1],
      ['SAP ', 'sap', 72, 1], ['AT ', 'et', 72, 0.5], ['HOME! ', 'om', 67, 1.5], ['', null, null, 1],
    ] },
    { bar: 36, syl: [
      ['La ', 'la', 65, 0.5], ['pa', 'pa', 65, 0.5], ['ghet', 'ghet', 67, 0.5], ['ta ', 'ta', 69, 0.5], ['va in ', 'vain', 70, 1],
      ['pay', 'pei', 69, 1], ['roll! ', 'rol', [67, 65], [1, 1]], ['', null, null, 2],
    ] },
    { bar: 38, syl: [
      ['SAP ', 'sap', 74, 1], ['AT ', 'et', 74, 0.5], ['HOME! ', 'om', 69, 1.5], ['', null, null, 1],
      ['SAP ', 'sap', 72, 1], ['AT ', 'et', 72, 0.5], ['HOME! ', 'om', 67, 1.5], ['', null, null, 1],
    ] },
    { bar: 40, syl: [
      ['Tut', 'tut', 65, 0.5], ['ta ', 'ta', 67, 0.5], ['la ', 'la', 69, 0.5], ['ca', 'ca', 70, 0.5], ['sa in ', 'sain', 69, 0.5],
      ['S', 'es', 72, 0.5], ['/', 'se', 72, 0.5], ['4! ', 'quat', 74, 1], ['', 'tro', [73, 74], [1, 1.5]], ['', null, null, 1],
    ] },
    // The last refrain, and the call.
    { bar: 46, syl: [
      ['SAP ', 'sap', 74, 1], ['AT ', 'et', 74, 0.5], ['HOME! ', 'om', 69, 1.5], ['', null, null, 1],
      ['SAP ', 'sap', 72, 1], ['AT ', 'et', 72, 0.5], ['HOME! ', 'om', 74, 1.5], ['', null, null, 1],
    ] },
    { bar: 48, syl: [
      ['Clau', 'clau', 69, 0.5], ['ddi', 'di', 65, 0.5], ['no ', 'no', 65, 0.5], ['ba', 'bei', 67, 0.5], ['byyyy… ', 'bi', [65, 62], [1, 1]],
      ['EM', 'em', 67, 0.5], ['ME', 'me', 69, 0.5], ['DI', 'di', 65, 0.5], ['OOOOO! ', 'o', [73, 74], [0.5, 2]],
    ] },
  ],
}
