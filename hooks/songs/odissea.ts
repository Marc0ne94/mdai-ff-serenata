// Written by tools/render.mjs from tools/songs/odissea.mjs: render again, do not edit.
// The timing is in seconds from the start of the audio, the same in every style.
// built 54501ce504f35dc3fd3b68f7dfd5ca0f67fc07c7123396e81d89b73634df8d7a
// source audio/odissea.m4a e42e92e92d0ae8eea5efa8c6224693f3c39fcca50d9501fb235985ffbb92a2f9 83ddd09ad2fe53b5d95999861ef2147c437a19c943f19c8d296d74bbf27931c7
// source audio/odissea-avanzato.m4a d5897e028a60b482b7e5380abf08b4144cbc4ecf8f618603ef23552a102dfe1a 79b4381e65603edc4df3b3e87ab16ddb96f1b53e5c02c92bab11f91fc9043a5b
// source audio/odissea-dita.m4a 02fba7ecc4e31b01657cc0e80a93e015b5d0529c0d63e4239ce72bb697ec286c 5b0f4746d05c54b8af33c2420c2d4e06102cacaa7b748778d6afb47f5e0633b8
// source audio/odissea-dita-avanzato.m4a 4508ba9eea4236023bbc9dca6edda66c1889167fd05fbb6f8b6be5e42ed51085 9394348e7b3c6255fa80ced1cf13464428d8ba30a653e0299068f27741e92a54
import type { Sounds, Timing } from '../song'

export const TIMING: Timing = {
  bpm: 72,
  beat: 0.83333,
  bar: 3.33333,
  duration: 56.833,
  outroAt: 46.667,
  bloomAt: 26.667,
  finaleAt: 33.333,
  lines: [
    { start: 6.667, end: 12.5, syls: [
      { text: "Sul ", start: 6.667, end: 7.083, open: 0.5 },
      { text: "ma", start: 7.083, end: 7.5, open: 1 },
      { text: "re ", start: 7.5, end: 8.333, open: 0.75 },
      { text: "co", start: 8.333, end: 8.75, open: 0.75 },
      { text: "lor ", start: 8.75, end: 9.167, open: 0.75 },
      { text: "del ", start: 9.167, end: 10, open: 0.75 },
      { text: "vi", start: 10, end: 10.833, open: 0.5 },
      { text: "no", start: 10.833, end: 12.5, open: 0.75 },
    ] },
    { start: 13.333, end: 19.167, syls: [
      { text: "il ", start: 13.333, end: 13.75, open: 0.5 },
      { text: "ven", start: 13.75, end: 14.167, open: 0.75 },
      { text: "to ", start: 14.167, end: 15, open: 0.75 },
      { text: "mi ", start: 15, end: 15.417, open: 0.5 },
      { text: "por", start: 15.417, end: 15.833, open: 0.75 },
      { text: "ta ", start: 15.833, end: 16.25, open: 1 },
      { text: "a ", start: 16.25, end: 16.667, open: 1 },
      { text: "te", start: 16.667, end: 19.167, open: 0.75 },
    ] },
    { start: 20, end: 25.833, syls: [
      { text: "i", start: 20, end: 20.417, open: 0.5 },
      { text: "so", start: 20.417, end: 20.833, open: 0.75 },
      { text: "le, ", start: 20.833, end: 21.667, open: 0.75 },
      { text: "stel", start: 21.667, end: 22.083, open: 0.75 },
      { text: "le ", start: 22.083, end: 22.5, open: 0.75 },
      { text: "e ", start: 22.5, end: 23.333, open: 0.75 },
      { text: "si", start: 23.333, end: 23.75, open: 0.5 },
      { text: "re", start: 23.75, end: 24.167, open: 0.75 },
      { text: "ne", start: 24.167, end: 25.833, open: 0.75 },
    ] },
    { start: 26.667, end: 33.333, syls: [
      { text: "Mu", start: 26.667, end: 27.5, open: 0.5 },
      { text: "sa, ", start: 27.5, end: 28.333, open: 1 },
      { text: "rac", start: 28.333, end: 28.75, open: 1 },
      { text: "con", start: 28.75, end: 29.167, open: 0.75 },
      { text: "ta", start: 29.167, end: 29.583, open: 1 },
      { text: "mi il ", start: 29.583, end: 30, open: 0.5 },
      { text: "lun", start: 30, end: 30.417, open: 0.5 },
      { text: "go ", start: 30.417, end: 30.833, open: 0.75 },
      { text: "ri", start: 30.833, end: 31.25, open: 0.5 },
      { text: "tor", start: 31.25, end: 32.083, open: 0.75 },
      { text: "no", start: 32.083, end: 33.333, open: 0.75 },
    ] },
    { start: 33.333, end: 39.583, syls: [
      { text: "I", start: 33.333, end: 33.75, open: 0.5 },
      { text: "ta", start: 33.75, end: 34.583, open: 1 },
      { text: "ca! ", start: 34.583, end: 35, open: 1 },
      { text: "I", start: 35, end: 35.417, open: 0.5 },
      { text: "ta", start: 35.417, end: 36.25, open: 1 },
      { text: "ca! ", start: 36.25, end: 36.667, open: 1 },
      { text: "È ", start: 36.667, end: 37.083, open: 0.75 },
      { text: "là!", start: 37.083, end: 39.583, open: 1 },
    ] },
    { start: 40, end: 46.667, syls: [
      { text: "e ", start: 40, end: 40.417, open: 0.75 },
      { text: "tor", start: 40.417, end: 41.25, open: 0.75 },
      { text: "no, ", start: 41.25, end: 41.667, open: 0.75 },
      { text: "can", start: 41.667, end: 42.083, open: 1 },
      { text: "tan", start: 42.083, end: 42.5, open: 1 },
      { text: "do ", start: 42.5, end: 43.333, open: 0.75 },
      { text: "per ", start: 43.333, end: 43.75, open: 0.75 },
      { text: "te", start: 43.75, end: 46.667, open: 0.75 },
    ] },
  ],
}

// The sound profiles this song is played in, and the voice styles of each with its audio.
export const AUDIO: Sounds = {
  plettro: {
    classico: 'audio/odissea.m4a',
    avanzato: 'audio/odissea-avanzato.m4a',
  },
  dita: {
    classico: 'audio/odissea-dita.m4a',
    avanzato: 'audio/odissea-dita-avanzato.m4a',
  },
}
