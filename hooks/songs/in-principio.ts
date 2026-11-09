// Written by tools/render.mjs from tools/songs/in-principio.mjs: render again, do not edit.
// The timing is in seconds from the start of the audio, the same in every style.
// built 103055ed31a9e2eb75263e44705a1fafcfa1bfd5919bbbf4814a98467337c21b
// source audio/in-principio.m4a e75d10b1bbff83935a8e62a6cde05643153930c4823c9f9057ef7a14b0c4d483 55ebdd7132446909fe52d06b2c3f73d6a6b3d3ce63f071ba63b6bacbe3256702
// source audio/in-principio-avanzato.m4a 0c35af4fc52fb567c47a104db8b28898988d26f21fb6e7aac220e079862b2d0d cd0fb34f7c71de5fd06bf5792f0c088c45c8adbf3225589f8fe76424a82bb0b7
import type { Sounds, Timing } from '../song'

export const TIMING: Timing = {
  bpm: 68,
  beat: 0.88235,
  bar: 3.52941,
  duration: 59.971,
  outroAt: 49.412,
  bloomAt: 28.235,
  finaleAt: 35.294,
  bassAt: 21.176,
  drumsAt: 28.235,
  lines: [
    { start: 7.059, end: 13.676, syls: [
      { text: "In ", start: 7.059, end: 7.5, open: 0.5 },
      { text: "prin", start: 7.5, end: 7.941, open: 0.5 },
      { text: "ci", start: 7.941, end: 8.382, open: 0.5 },
      { text: "pio ", start: 8.382, end: 8.824, open: 0.75 },
      { text: "fu ", start: 8.824, end: 9.265, open: 0.5 },
      { text: "il ", start: 9.265, end: 9.706, open: 0.5 },
      { text: "M", start: 9.706, end: 10.588, open: 0.75 },
      { text: "A", start: 10.588, end: 11.471, open: 0.75 },
      { text: "V, ", start: 11.471, end: 13.676, open: 0.5 },
    ] },
    { start: 14.118, end: 21.176, syls: [
      { text: "un ", start: 14.118, end: 14.559, open: 0.5 },
      { text: "fio", start: 14.559, end: 15.441, open: 0.75 },
      { text: "re in ", start: 15.441, end: 15.882, open: 0.75 },
      { text: "ma", start: 15.882, end: 16.765, open: 1 },
      { text: "no, ", start: 16.765, end: 17.647, open: 0.75 },
      { text: "det", start: 17.647, end: 18.088, open: 0.75 },
      { text: "to ", start: 18.088, end: 18.529, open: 0.75 },
      { text: "pia", start: 18.529, end: 19.412, open: 1 },
      { text: "no; ", start: 19.412, end: 21.176, open: 0.75 },
    ] },
    { start: 21.176, end: 27.794, syls: [
      { text: "e ", start: 21.176, end: 21.618, open: 0.75 },
      { text: "poi ", start: 21.618, end: 22.059, open: 0.75 },
      { text: "ven", start: 22.059, end: 22.5, open: 0.75 },
      { text: "ne ", start: 22.5, end: 22.941, open: 0.75 },
      { text: "l'M", start: 22.941, end: 23.382, open: 0.75 },
      { text: "", start: 23.382, end: 23.824, open: 0.75 },
      { text: "2", start: 23.824, end: 24.706, open: 0.75 },
      { text: "V, ", start: 24.706, end: 27.794, open: 0.5 },
    ] },
    { start: 28.235, end: 34.853, syls: [
      { text: "e il ", start: 28.235, end: 28.676, open: 0.75 },
      { text: "cuo", start: 28.676, end: 30, open: 0.75 },
      { text: "re ", start: 30, end: 30.441, open: 0.75 },
      { text: "rad", start: 30.441, end: 30.882, open: 1 },
      { text: "dop", start: 30.882, end: 31.765, open: 0.75 },
      { text: "piò… ", start: 31.765, end: 34.853, open: 0.75 },
    ] },
    { start: 35.294, end: 42.353, syls: [
      { text: "Sei ", start: 35.294, end: 35.735, open: 0.75 },
      { text: "tu… ", start: 35.735, end: 37.5, open: 0.5 },
      { text: "da ", start: 37.5, end: 37.941, open: 1 },
      { text: "sem", start: 37.941, end: 38.382, open: 0.75 },
      { text: "pre, ", start: 38.382, end: 38.824, open: 0.75 },
      { text: "sei ", start: 38.824, end: 39.265, open: 0.75 },
      { text: "tu.", start: 39.265, end: 42.353, open: 0.5 },
    ] },
    { start: 42.353, end: 49.412, syls: [
      { text: "E ", start: 42.353, end: 42.794, open: 0.75 },
      { text: "per ", start: 42.794, end: 43.235, open: 0.75 },
      { text: "sem", start: 43.235, end: 43.676, open: 0.75 },
      { text: "pre, ", start: 43.676, end: 44.118, open: 0.75 },
      { text: "l'M", start: 44.118, end: 44.559, open: 0.75 },
      { text: "", start: 44.559, end: 45, open: 0.75 },
      { text: "4", start: 45, end: 45.441, open: 1 },
      { text: "", start: 45.441, end: 45.882, open: 0.75 },
      { text: "V.", start: 45.882, end: 49.412, open: 0.5 },
    ] },
  ],
}

// The sound profiles this song is played in, and the voice styles of each with its audio.
export const AUDIO: Sounds = {
  pop: {
    classico: 'audio/in-principio.m4a',
    avanzato: 'audio/in-principio-avanzato.m4a',
  },
}
