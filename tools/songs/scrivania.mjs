// La mia scrivania ha una scrivania: the second song of MDO, a rock song in
// the manner of heavy metal, Marco's own idea and words for its refrain. It
// opens as a record opens on its guest: a call, «Clauddino babyyy…
// EMMEDIOOOO!», over a chord left to ring. Then the screen goes on at night,
// and in it the room, the chair, the lamp: on the desk, a desk. The refrain
// says so, and that the whole PC is there to use, the last «PC» screamed and
// held. In the second verse the fan sings and screams, a hundred windows are
// open, and inside the screen another screen, with another me waving; then a
// guitar solo, the call again, and the refrain to the end. Its words, tune,
// riff and solo are its own.
// E minor, at 144: the riff gallops (an eighth and two sixteenths) on E, with
// a half step down from G to F at the end of its first bar, as metal does; the
// refrain climbs E, C, G, D. The voice stays at or under G4 on every i, where
// the voice keeps its colour. Played by the metal orchestra (see
// tools/synth.mjs): the band headbangs to it in the drops.
// Sung only in the advanced voice: its words need b, g, v and z (babyyy,
// guarda, scrivania, stanza).
export default {
  bpm: 144,
  seed: 20261124,
  audio: { metal: { avanzato: 'audio/scrivania.m4a' } },
  // The voice above the other songs, to ride over the guitars, and the whole
  // song at their level (see tools/synth.mjs).
  voiceRms: 0.16,
  masterLevel: -17,
  // The riff alone; with the call, the bass under the ringing chord; the drums
  // after it.
  build: { bass: 2, drums: 4 },
  form: [['intro', 2], ['verse', 10], ['break', 2], ['drop', 8], ['verse', 8], ['verse', 4], ['break', 2], ['drop', 8], ['outro', 2]],
  // name: [bass root (MIDI), chord intervals]: power chords, root, fifth and octave.
  chords: {
    E5: [40, [0, 7, 12]],
    F5: [41, [0, 7, 12]],
    G5: [43, [0, 7, 12]],
    A5: [45, [0, 7, 12]],
    B5: [47, [0, 7, 12]],
    C5: [48, [0, 7, 12]],
    D5: [50, [0, 7, 12]],
  },
  // One entry per bar: [chord, beats] pairs.
  bars: [
    // The riff, alone.
    [['E5', 3], ['G5', 0.5], ['F5', 0.5]], [['E5', 2], ['A5', 1], ['G5', 1]],
    // The call, over E left to ring.
    [['E5', 4]], [['E5', 4]],
    // The first verse, on the riff.
    [['E5', 3], ['G5', 0.5], ['F5', 0.5]], [['E5', 2], ['A5', 1], ['G5', 1]],
    [['E5', 3], ['G5', 0.5], ['F5', 0.5]], [['E5', 2], ['A5', 1], ['G5', 1]],
    [['E5', 3], ['G5', 0.5], ['F5', 0.5]], [['E5', 2], ['A5', 1], ['G5', 1]],
    [['E5', 3], ['G5', 0.5], ['F5', 0.5]], [['E5', 2], ['A5', 1], ['G5', 1]],
    // Guarda bene.
    [['C5', 4]], [['D5', 4]],
    // The refrain.
    [['E5', 4]], [['C5', 4]], [['G5', 4]], [['D5', 4]], [['E5', 4]], [['C5', 4]], [['G5', 4]], [['D5', 4]],
    // The second verse.
    [['E5', 3], ['G5', 0.5], ['F5', 0.5]], [['E5', 2], ['A5', 1], ['G5', 1]],
    [['E5', 3], ['G5', 0.5], ['F5', 0.5]], [['E5', 2], ['A5', 1], ['G5', 1]],
    [['E5', 3], ['G5', 0.5], ['F5', 0.5]], [['E5', 2], ['A5', 1], ['G5', 1]],
    [['E5', 3], ['G5', 0.5], ['F5', 0.5]], [['E5', 2], ['A5', 1], ['G5', 1]],
    // The solo.
    [['E5', 4]], [['C5', 4]], [['D5', 4]], [['B5', 4]],
    // The call again.
    [['C5', 4]], [['D5', 4]],
    // The refrain to the end.
    [['E5', 4]], [['C5', 4]], [['G5', 4]], [['D5', 4]], [['E5', 4]], [['C5', 4]], [['G5', 4]], [['D5', 4]],
    // The last hit.
    [['E5', 4]], [['E5', 4]],
  ],
  // The lead guitar's solo, from the first bar of the solo: [midi, beats], and
  // a third number to bend up into the note by that many semitones.
  solo: [
    [71, 0.5], [74, 0.5], [76, 1], [79, 0.5], [76, 0.5], [74, 0.5], [76, 0.5],
    [79, 1], [76, 0.25], [74, 0.25], [72, 0.5], [71, 0.5], [72, 0.5], [74, 1],
    [74, 0.25], [76, 0.25], [78, 0.25], [79, 0.25], [81, 0.5], [79, 0.5], [78, 0.5], [76, 0.5], [74, 1],
    [75, 1], [78, 1], [83, 2, 2],
  ],
  // [display, sung spelling, midi | midi[], beats | beats[]]; a null spelling is a rest
  lines: [
    // The call.
    { bar: 2, syl: [
      ['Clau', 'clau', 71, 0.5], ['ddi', 'di', 67, 0.5], ['no ', 'no', 67, 0.5], ['ba', 'bei', 69, 0.5], ['byyy… ', 'bi', [67, 64], [1, 1]],
      ['EM', 'em', 69, 0.5], ['ME', 'me', 71, 0.5], ['DI', 'di', 67, 0.5], ['OOOO! ', 'o', [76, 74], [2, 0.5]],
    ] },
    // The first verse.
    { bar: 4, syl: [
      ['Ac', 'a', 64, 0.5], ['cen', 'cen', 64, 0.5], ['do ', 'do', 67, 0.5], ['lo ', 'lo', 64, 0.5], ['scher', 'scher', 69, 0.5], ['mo, ', 'mo', 67, 0.5],
      ['è ', 'e', 64, 0.5], ['not', 'not', 62, 0.5], ['te ', 'te', 64, 0.5], ['fon', 'fon', 67, 0.5], ['da, ', 'da', 64, 1.5], ['', null, null, 1.5],
    ] },
    { bar: 6, syl: [
      ['e ', 'e', 64, 0.5], ['den', 'den', 64, 0.5], ['tro ', 'tro', 67, 0.5], ['lo ', 'lo', 64, 0.5], ['scher', 'scher', 69, 0.5], ['mo ', 'mo', 67, 0.5],
      ["c'è ", 'ce', 69, 0.5], ['la ', 'la', 71, 0.5], ['mia ', 'mia', 69, 0.5], ['stan', 'stan', 67, 0.5], ['za: ', 'za', 64, 1.5], ['', null, null, 1.5],
    ] },
    { bar: 8, syl: [
      ['la ', 'la', 64, 0.5], ['se', 'se', 67, 0.5], ['dia, ', 'dia', 64, 1], ['la ', 'la', 64, 0.5], ['lam', 'lam', 69, 0.5], ['pa', 'pa', 67, 0.5], ['da, ', 'da', 64, 1],
      ['o', 'o', 62, 0.5], ['gni ', 'gni', 64, 0.5], ['cas', 'cas', 67, 0.5], ['set', 'set', 67, 0.5], ['to, ', 'to', 64, 1], ['', null, null, 0.5],
    ] },
    { bar: 10, syl: [
      ['e ', 'e', 62, 0.5], ['so', 'so', 64, 0.5], ['pra il ', 'prail', 67, 0.5], ['ta', 'ta', 69, 0.5], ['vo', 'vo', 71, 0.5], ['lo… ', 'lo', 69, 1], ['', null, null, 0.5],
      ['che ', 'che', 71, 0.5], ['co', 'co', 72, 0.5], ['sa ', 'sa', 71, 0.5], ["c'è? ", 'ce', [74, 76], [1, 1]], ['', null, null, 0.5],
    ] },
    // Guarda bene.
    { bar: 12, syl: [
      ['Guar', 'guar', 67, 1], ['da ', 'da', 67, 0.5], ['be', 'be', 69, 0.5], ['ne… ', 'ne', 71, 1.5], ['', null, null, 0.5],
      ['guar', 'guar', 72, 1], ['da ', 'da', 72, 0.5], ['be', 'be', 74, 0.5], ['ne! ', 'ne', 76, 1.5], ['', null, null, 0.5],
    ] },
    // The refrain.
    { bar: 14, syl: [
      ['La ', 'la', 67, 0.5], ['mia ', 'mia', 71, 0.5], ['scri', 'scri', 67, 0.5], ['va', 'va', 71, 0.5], ['nia ', 'nia', 72, 1],
      ['ha u', 'au', 71, 0.5], ['na ', 'na', 69, 0.5], ['scri', 'scri', 67, 0.5], ['va', 'va', 71, 0.5], ['nia! ', 'nia', [74, 72], [1.5, 0.5]], ['', null, null, 1],
    ] },
    { bar: 16, syl: [
      ['pos', 'pos', 74, 0.5], ['so u', 'sou', 74, 0.5], ['sa', 'sa', 76, 0.5], ['re, ', 're', 74, 1], ['', null, null, 0.5],
      ['pos', 'pos', 74, 0.5], ['so u', 'sou', 74, 0.5], ['sa', 'sa', 72, 0.5], ['re ', 're', [71, 69], [1, 1]], ['', null, null, 1.5],
    ] },
    { bar: 18, syl: [
      ['tut', 'tut', 71, 0.5], ['to il ', 'toil', 71, 0.5], ['mio ', 'mio', 74, 1], ['P', 'pi', 67, 1], ['C, ', 'ci', [67, 64], [1.5, 1.5]], ['', null, null, 2],
    ] },
    { bar: 20, syl: [
      ['tut', 'tut', 71, 0.5], ['to il ', 'toil', 71, 0.5], ['mio ', 'mio', 74, 1], ['P', 'pi', 67, 1], ['CCCCCCC! ', 'ci', [62, 67], [0.5, 4.5]],
    ] },
    // The second verse.
    { bar: 22, syl: [
      ['La ', 'la', 64, 0.5], ['ven', 'ven', 67, 0.5], ['to', 'to', 64, 0.5], ['la ', 'la', 64, 0.5], ['can', 'can', 69, 0.5], ['ta, ', 'ta', 67, 1],
      ['la ', 'la', 64, 0.5], ['ven', 'ven', 67, 0.5], ['to', 'to', 64, 0.5], ['la ', 'la', 64, 0.5], ['ur', 'ur', 71, 0.5], ['la! ', 'la', 72, 1.5], ['', null, null, 0.5],
    ] },
    { bar: 24, syl: [
      ['cen', 'cen', 64, 0.5], ['to ', 'to', 64, 0.5], ['fi', 'fi', 67, 0.5], ['ne', 'ne', 67, 0.5], ['stre ', 'stre', 69, 1],
      ['tut', 'tut', 67, 0.5], ['te a', 'tea', 67, 0.5], ['per', 'per', 69, 0.5], ['te, ', 'te', 64, 1.5], ['', null, null, 2],
    ] },
    { bar: 26, syl: [
      ['e ', 'e', 64, 0.5], ['den', 'den', 64, 0.5], ['tro ', 'tro', 67, 0.5], ['lo ', 'lo', 64, 0.5], ['scher', 'scher', 69, 0.5], ['mo ', 'mo', 67, 0.5],
      ['un ', 'un', 69, 0.5], ['al', 'al', 71, 0.5], ['tro ', 'tro', 69, 0.5], ['scher', 'scher', 67, 0.5], ['mo, ', 'mo', 64, 1.5], ['', null, null, 1.5],
    ] },
    { bar: 28, syl: [
      ['e un ', 'eun', 64, 0.5], ['al', 'al', 67, 0.5], ['tro ', 'tro', 67, 0.5], ['me ', 'me', 69, 0.5],
      ['che ', 'che', 67, 0.5], ['mi ', 'mi', 67, 0.5], ['sa', 'sa', 69, 0.5], ['lu', 'lu', 71, 0.5], ['ta: ', 'ta', 69, 0.5], ['ciao! ', 'ciao', [74, 76], [1, 1.5]], ['', null, null, 1],
    ] },
    // The call again.
    { bar: 34, syl: [
      ['Clau', 'clau', 71, 0.5], ['ddi', 'di', 67, 0.5], ['no ', 'no', 67, 0.5], ['ba', 'bei', 69, 0.5], ['byyy… ', 'bi', [67, 64], [1, 1]],
      ['EM', 'em', 69, 0.5], ['ME', 'me', 71, 0.5], ['DI', 'di', 67, 0.5], ['OOOO! ', 'o', [76, 74], [2, 0.5]],
    ] },
    // The refrain to the end.
    { bar: 36, syl: [
      ['La ', 'la', 67, 0.5], ['mia ', 'mia', 71, 0.5], ['scri', 'scri', 67, 0.5], ['va', 'va', 71, 0.5], ['nia ', 'nia', 72, 1],
      ['ha u', 'au', 71, 0.5], ['na ', 'na', 69, 0.5], ['scri', 'scri', 67, 0.5], ['va', 'va', 71, 0.5], ['nia! ', 'nia', [74, 72], [1.5, 0.5]], ['', null, null, 1],
    ] },
    { bar: 38, syl: [
      ['pos', 'pos', 74, 0.5], ['so u', 'sou', 74, 0.5], ['sa', 'sa', 76, 0.5], ['re, ', 're', 74, 1], ['', null, null, 0.5],
      ['pos', 'pos', 74, 0.5], ['so u', 'sou', 74, 0.5], ['sa', 'sa', 72, 0.5], ['re ', 're', [71, 69], [1, 1]], ['', null, null, 1.5],
    ] },
    { bar: 40, syl: [
      ['tut', 'tut', 71, 0.5], ['to il ', 'toil', 71, 0.5], ['mio ', 'mio', 74, 1], ['P', 'pi', 67, 1], ['C, ', 'ci', [67, 64], [1.5, 1.5]], ['', null, null, 2],
    ] },
    { bar: 42, syl: [
      ['tut', 'tut', 71, 0.5], ['to il ', 'toil', 71, 0.5], ['mio ', 'mio', 74, 1], ['P', 'pi', 67, 1], ['CCCCCCC! ', 'ci', [62, 67], [0.5, 4.5]],
    ] },
  ],
}
