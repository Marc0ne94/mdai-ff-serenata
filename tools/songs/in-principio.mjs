// In principio fu il MAV: the sequel of the Serenata, a love story told in three
// acronyms, the first, the second and the last (MAV, M2V, M4V), spelled out
// letter by letter as Italian says them (emme-a-vu), slowly, each held. A slow
// ballad that builds up from a piano alone. It quotes the Serenata, its key,
// A minor, its flower in hand said softly; the chorus sings to someone, «da
// sempre» (since always), and the last line answers it, «per sempre» (for
// ever), on A major, where the Serenata could not end. Played by the band.
// Same 16-bar form (see tools/synth.mjs).
export default {
  bpm: 68,
  seed: 20261110,
  // The sound profiles it is played in, and the voice styles of each with its audio file (see tools/render.mjs).
  audio: { pop: { classico: 'audio/in-principio.m4a', avanzato: 'audio/in-principio-avanzato.m4a' } },
  // The voice at the level of the other songs in both styles, and the whole song
  // at the level of their verses (see tools/synth.mjs).
  voiceRms: 0.13,
  masterLevel: -17,
  // It grows with its story: the MAV sung over a soft piano alone, the bass
  // coming in with the M2V, a heartbeat under «il cuore raddoppiò» and the full
  // band only at the chorus (see tools/synth.mjs).
  build: { bass: 6, pad: 8, heartbeat: 8, drums: 10, piano: 6 },
  // name: [bass root (MIDI), chord intervals]
  chords: {
    Am7: [45, [0, 3, 7, 10]],
    Fmaj7: [41, [0, 4, 7, 11]],
    Cmaj7: [48, [0, 4, 7, 11]],
    G: [43, [0, 4, 7]],
    Gsus4: [43, [0, 5, 7]],
    Dm7: [38, [0, 3, 7, 10]],
    E7: [40, [0, 4, 7, 10]],
    A: [45, [0, 4, 7]],
  },
  // One entry per bar: [chord, beats] pairs.
  bars: [
    [['Am7', 4]], [['Fmaj7', 2], ['G', 2]],
    [['Am7', 4]], [['Fmaj7', 4]], [['Cmaj7', 4]], [['G', 2], ['E7', 2]],
    [['Am7', 4]], [['Fmaj7', 4]], [['Dm7', 4]], [['Gsus4', 2], ['G', 2]],
    [['Fmaj7', 4]], [['Cmaj7', 4]], [['Dm7', 2], ['E7', 2]], [['A', 4]],
    [['Fmaj7', 4]], [['A', 4]],
  ],
  // [display, sung spelling, midi | midi[], beats | beats[]]; a null spelling is a rest
  lines: [
    { bar: 2, syl: [
      ['In ', 'in', 62, 0.5], ['prin', 'prin', 64, 0.5], ['ci', 'ci', 64, 0.5], ['pio ', 'pio', 67, 0.5], ['fu ', 'fu', 67, 0.5], ['il ', 'il', 64, 0.5],
      ['M', 'em', 69, 1], ['A', 'mea', 71, 1], ['V, ', 'vu', [72, 74], [1.5, 1]], ['', null, null, 0.5],
    ] },
    { bar: 4, syl: [
      ['un ', 'un', 67, 0.5], ['fio', 'fio', 71, 1], ['re in ', 'rein', 69, 0.5], ['ma', 'ma', 72, 1], ['no, ', 'no', 71, 1],
      ['det', 'de', 69, 0.5], ['to ', 'to', 67, 0.5], ['pia', 'pia', 67, 1], ['no; ', 'no', [68, 64], [1, 1]],
    ] },
    { bar: 6, syl: [
      ['e ', 'e', 64, 0.5], ['poi ', 'poi', 69, 0.5], ['ven', 'ven', 71, 0.5], ['ne ', 'ne', 72, 0.5], ["l'M", 'lem', 72, 0.5], ['', 'me', 71, 0.5],
      ['2', 'due', 72, 1], ['V, ', 'vu', [76, 72], [1.5, 2]], ['', null, null, 0.5],
    ] },
    { bar: 8, syl: [
      ['e il ', 'eil', 69, 0.5], ['cuo', 'cuo', 74, 1.5], ['re ', 're', 72, 0.5], ['rad', 'ra', 72, 0.5], ['dop', 'do', 71, 1],
      ['piò… ', 'pio', [72, 71], [2, 1.5]], ['', null, null, 0.5],
    ] },
    { bar: 10, syl: [
      ['Sei ', 'sei', 72, 0.5], ['tu… ', 'tu', 76, 2], ['da ', 'da', 72, 0.5], ['sem', 'sem', 74, 0.5], ['pre, ', 'pre', 76, 0.5],
      ['sei ', 'sei', 74, 0.5], ['tu.', 'tu', [71, 72], [1.5, 2]],
    ] },
    { bar: 12, syl: [
      ['E ', 'e', 69, 0.5], ['per ', 'per', 72, 0.5], ['sem', 'sem', 74, 0.5], ['pre, ', 'pre', 72, 0.5],
      ["l'M", 'lem', 71, 0.5], ['', 'me', 68, 0.5], ['4', 'kua', 71, 0.5], ['', 'tro', 74, 0.5], ['V.', 'vu', [76, 73], [1.5, 2.5]],
    ] },
  ],
}
