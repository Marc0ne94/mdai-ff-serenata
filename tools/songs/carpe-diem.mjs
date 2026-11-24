// Carpe diem: Horace to Leuconoe, Odes I, 11. Do not ask, it is not ours to
// know, what end the gods will give to me, to you, and leave the numbers of
// Babylon alone; better to take what comes. Be it the last winter or one of
// many, strain the wine, cut the long hope short. While we are speaking, time
// has already fled: pluck the day, and trust tomorrow as little as you can.
// The words are a paraphrase in plain Italian; the refrain keeps his Latin,
// «carpe diem», and the winter sea he names, wearing itself out on the rocks,
// is in the window of the stage instead of in the words.
// On the white keys throughout: the verses around E (phrygian, its second a
// half step up, an old colour), the refrain on G with F below it (mixolydian).
// That low seventh is the horn's doing: the cornu has only the harmonics of
// its tube, a G, and the seventh of them is an F; so the refrain turns on F
// and G, the two notes the horn holds under it. Played by the Roman orchestra
// (see tools/synth.mjs). A form of its own: four lines, the refrain, two
// lines more, a break where the band stops for «mentre parliamo», and the
// refrain again with the Latin alone to close.
// Sung only in the advanced voice: its words need b, g, v and z (Babilonia,
// giorno, vino, speranza).
export default {
  bpm: 84,
  seed: 20261111,
  audio: { romana: { avanzato: 'audio/carpe-diem.m4a' } },
  // The voice at the level of the other songs, and the whole song at the level
  // of their verses (see tools/synth.mjs).
  voiceRms: 0.13,
  masterLevel: -17,
  form: [['intro', 2], ['verse', 8], ['drop', 4], ['verse', 4], ['break', 2], ['drop', 6], ['outro', 2]],
  // The cornu's own tune, before the voice (bars 0-1) and after it (the outro):
  // [midi, beats], natural notes of a tube in G only (G3, D4, F4, G4, A4).
  cornu: {
    intro: [[55, 1], [62, 0.5], [62, 0.5], [67, 2], [65, 1.5], [62, 0.5], [67, 2]],
    outro: [[65, 1.5], [69, 0.5], [65, 1], [62, 1], [67, 3]],
  },
  // name: [bass root (MIDI), chord intervals]
  chords: {
    Em: [40, [0, 3, 7]],
    F: [41, [0, 4, 7]],
    G: [43, [0, 4, 7]],
    Am: [45, [0, 3, 7]],
    C: [48, [0, 4, 7]],
    Dm: [38, [0, 3, 7]],
  },
  // One entry per bar: [chord, beats] pairs.
  bars: [
    [['G', 4]], [['F', 2], ['G', 2]],
    [['Em', 4]], [['F', 4]], [['Em', 4]], [['Dm', 4]], [['C', 4]], [['G', 4]], [['Am', 4]], [['Dm', 2], ['F', 2]],
    [['G', 4]], [['F', 4]], [['C', 4]], [['F', 2], ['G', 2]],
    [['Em', 4]], [['F', 4]], [['Am', 4]], [['Dm', 4]],
    [['C', 4]], [['Am', 2], ['F', 2]],
    [['G', 4]], [['F', 4]], [['C', 4]], [['F', 2], ['G', 2]], [['C', 2], ['F', 2]], [['G', 4]],
    [['F', 4]], [['G', 4]],
  ],
  // [display, sung spelling, midi | midi[], beats | beats[]]; a null spelling is a rest
  lines: [
    // Tu ne quaesieris, scire nefas, quem mihi, quem tibi finem di dederint.
    { bar: 2, syl: [
      ['Non ', 'non', 64, 0.5], ['chie', 'chie', 67, 1], ['de', 'de', 69, 0.5], ['re, ', 're', 71, 1], ['non ', 'non', 71, 0.5], ['è ', 'e', 72, 0.5],
      ['da', 'da', 72, 1], ['to ', 'to', 69, 0.5], ['sa', 'sa', 67, 0.5], ['pe', 'pe', 69, 1], ['re', 're', 65, 0.5], ['', null, null, 0.5],
    ] },
    { bar: 4, syl: [
      ['che ', 'che', 64, 0.5], ['fi', 'fi', 67, 1], ['ne a ', 'nea', 69, 0.5], ['me, ', 'me', 71, 1], ['a ', 'a', 71, 0.5], ['te ', 'te', 72, 1],
      ['da', 'da', 69, 0.5], ['ran', 'ran', 67, 0.5], ['no ', 'no', 65, 0.25], ['gli ', 'gli', 65, 0.25], ['dèi; ', 'dei', 62, 1.5], ['', null, null, 0.5],
    ] },
    // Nec Babylonios temptaris numeros. Ut melius, quidquid erit, pati.
    { bar: 6, syl: [
      ['né ', 'ne', 67, 0.5], ['ten', 'ten', 67, 0.5], ['ta', 'ta', 72, 1], ['re i ', 'rei', 71, 0.5], ['nu', 'nu', 72, 1], ['me', 'me', 69, 0.5], ['ri ', 'ri', 67, 0.5],
      ['di ', 'di', 67, 0.5], ['Ba', 'ba', 71, 0.5], ['bi', 'bi', 71, 0.5], ['lo', 'lo', 74, 1], ['nia: ', 'nia', 71, 0.5], ['', null, null, 0.5],
    ] },
    { bar: 8, syl: [
      ['me', 'me', 69, 1], ['glio ac', 'glioa', 69, 0.5], ['cet', 'cet', 71, 0.5], ['ta', 'ta', 72, 1], ['re ', 're', 69, 1],
      ['quel ', 'quel', 62, 0.5], ['che ', 'che', 65, 0.5], ['sa', 'sa', 67, 1], ['rà. ', 'ra', [69, 72], [1, 1]],
    ] },
    // Carpe diem, quam minimum credula postero.
    { bar: 10, syl: [
      ['Car', 'car', 67, 1.5], ['pe ', 'pe', 67, 0.5], ['di', 'di', 71, 0.5], ['em! ', 'em', 74, 1.5],
      ['Co', 'co', 72, 1.5], ['gli il ', 'glil', 69, 0.5], ['gior', 'gior', 72, 1], ['no, ', 'no', 69, 0.5], ['', null, null, 0.5],
    ] },
    { bar: 12, syl: [
      ['e ', 'e', 67, 0.25], ['al ', 'al', 67, 0.25], ['do', 'do', 69, 0.5], ['ma', 'ma', 72, 1], ['ni ', 'ni', 69, 0.5], ['cre', 'cre', 72, 1], ['di il ', 'dil', 67, 0.5],
      ['me', 'me', 69, 1], ['no ', 'no', 69, 0.5], ['che ', 'che', 72, 0.5], ['puoi! ', 'puoi', 74, 1.5], ['', null, null, 0.5],
    ] },
    // Seu pluris hiemes seu tribuit Iuppiter ultimam: sapias, vina liques, et
    // spatio brevi spem longam reseces.
    { bar: 14, syl: [
      ['Sia ', 'sia', 64, 0.5], ["l'ul", 'lul', 67, 1], ['ti', 'ti', 69, 0.5], ['mo in', 'moin', 71, 0.5], ['ver', 'ver', 71, 1], ['no o ', 'no', 72, 0.5],
      ['u', 'u', 72, 1], ['no ', 'no', 69, 0.5], ['fra ', 'fra', 67, 0.5], ['tan', 'tan', 69, 1], ['ti: ', 'ti', 65, 0.5], ['', null, null, 0.5],
    ] },
    // The line is cut short, as the hope it sings.
    { bar: 16, syl: [
      ['fil', 'fil', 69, 1], ['tra il ', 'trail', 71, 0.5], ['vi', 'vi', 67, 1], ['no, ', 'no', 64, 0.5], ['e ', 'e', 64, 0.25], ['ac', 'a', 64, 0.25], ['cor', 'cor', 65, 1],
      ['cia ', 'cia', 67, 0.5], ['la ', 'la', 69, 0.5], ['spe', 'spe', 69, 0.5], ['ran', 'ran', 72, 1], ['za. ', 'za', 69, 0.5], ['', null, null, 0.5],
    ] },
    // The break: dum loquimur, fugerit invida aetas.
    { bar: 18, syl: [
      ['Men', 'men', 67, 1], ['tre ', 'tre', 67, 0.5], ['par', 'par', 69, 0.5], ['lia', 'lia', 72, 1], ['mo il ', 'moil', 67, 1],
      ['tem', 'tem', 69, 0.5], ['po è ', 'poe', 67, 0.5], ['già ', 'gia', 64, 0.5], ['fug', 'fu', 65, 0.5], ['gi', 'gi', 65, 1], ['to… ', 'to', 62, 0.5], ['', null, null, 0.5],
    ] },
    // The refrain again.
    { bar: 20, syl: [
      ['Car', 'car', 67, 1.5], ['pe ', 'pe', 67, 0.5], ['di', 'di', 71, 0.5], ['em! ', 'em', 74, 1.5],
      ['Co', 'co', 72, 1.5], ['gli il ', 'glil', 69, 0.5], ['gior', 'gior', 72, 1], ['no, ', 'no', 69, 0.5], ['', null, null, 0.5],
    ] },
    { bar: 22, syl: [
      ['e ', 'e', 67, 0.25], ['al ', 'al', 67, 0.25], ['do', 'do', 69, 0.5], ['ma', 'ma', 72, 1], ['ni ', 'ni', 69, 0.5], ['cre', 'cre', 72, 1], ['di il ', 'dil', 67, 0.5],
      ['me', 'me', 69, 1], ['no ', 'no', 69, 0.5], ['che ', 'che', 72, 0.5], ['puoi! ', 'puoi', 74, 1.5], ['', null, null, 0.5],
    ] },
    // The Latin alone, down the chord of G to its G.
    { bar: 24, syl: [
      ['Car', 'car', 76, 1.5], ['pe ', 'pe', 76, 0.5], ['di', 'di', 74, 0.5], ['em! ', 'em', 72, 1.5],
      ['Car', 'car', 74, 1.5], ['pe ', 'pe', 74, 0.5], ['di', 'di', 71, 0.5], ['em!', 'em', 67, 1.5],
    ] },
  ],
}
