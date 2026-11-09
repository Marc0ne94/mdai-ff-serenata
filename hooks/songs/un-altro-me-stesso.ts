// Written by tools/render.mjs from tools/songs/un-altro-me-stesso.mjs: render again, do not edit.
// The timing is in seconds from the start of the audio, the same in every style.
// built 53d0e63952bf518a3a26c7fd279dacc3f7ffc6bf0fe7fc1b185bd952be1ed763
// source audio/un-altro-me-stesso.m4a 63a95c9ddee748550d79dae34f1c3f80bdf257d289840d364ec0106e33a48183 d76e97ab8248f791f7ba514655eecfea8b651bb912a4edc619ce774a1b5ba057
// source audio/un-altro-me-stesso-avanzato.m4a 642050fb2b97b6267761440b8723276ec34a21d82e19dbc543697e1a0d33b9c8 2ca36ff03365ac7155999af06c46e03a65171e3ccd47668ebdc0d21b4c2c247d
// source audio/un-altro-me-stesso-dita.m4a 4687609a74237025cdc5a2af4265418993f5a262adab7451adb3bb40d4cf815d 6af164e3188707d10a5de115f94db0c4ca1b26557c59358d3b786f5bd4015388
// source audio/un-altro-me-stesso-dita-avanzato.m4a 20f1331c1db167ffd8aa79c381110555de67ca7c4c4e54ebeadc7a3861021ca7 033c83a755ab66ea8058cc98ac62782d14ad0373758f040cd15a2fe060ca275b
import type { Sounds, Timing } from '../song'

export const TIMING: Timing = {
  bpm: 80,
  beat: 0.75,
  bar: 3,
  duration: 51.5,
  outroAt: 42,
  bloomAt: 24,
  finaleAt: 30,
  lines: [
    { start: 6, end: 12, syls: [
      { text: "Sen", start: 6, end: 6.375, open: 0.75 },
      { text: "za a", start: 6.375, end: 6.75, open: 1 },
      { text: "mi", start: 6.75, end: 7.125, open: 0.5 },
      { text: "ci ", start: 7.125, end: 7.5, open: 0.5 },
      { text: "nes", start: 7.5, end: 7.875, open: 0.75 },
      { text: "su", start: 7.875, end: 8.25, open: 0.5 },
      { text: "no ", start: 8.25, end: 9, open: 0.75 },
      { text: "vor", start: 9, end: 9.375, open: 0.75 },
      { text: "reb", start: 9.375, end: 9.75, open: 0.75 },
      { text: "be ", start: 9.75, end: 10.125, open: 0.75 },
      { text: "vi", start: 10.125, end: 10.5, open: 0.5 },
      { text: "ve", start: 10.5, end: 10.875, open: 0.75 },
      { text: "re", start: 10.875, end: 12, open: 0.75 },
    ] },
    { start: 12, end: 17.625, syls: [
      { text: "an", start: 12, end: 12.375, open: 1 },
      { text: "che ", start: 12.375, end: 12.75, open: 0.75 },
      { text: "a", start: 12.75, end: 13.125, open: 1 },
      { text: "ven", start: 13.125, end: 13.5, open: 0.75 },
      { text: "do ", start: 13.5, end: 14.25, open: 0.75 },
      { text: "o", start: 14.25, end: 14.625, open: 0.75 },
      { text: "gni ", start: 14.625, end: 15, open: 0.5 },
      { text: "al", start: 15, end: 15.375, open: 1 },
      { text: "tro ", start: 15.375, end: 15.75, open: 0.75 },
      { text: "be", start: 15.75, end: 16.5, open: 0.75 },
      { text: "ne", start: 16.5, end: 17.625, open: 0.75 },
    ] },
    { start: 18, end: 23.25, syls: [
      { text: "l'a", start: 18, end: 18.375, open: 1 },
      { text: "mi", start: 18.375, end: 18.75, open: 0.5 },
      { text: "co è ", start: 18.75, end: 19.125, open: 0.75 },
      { text: "un ", start: 19.125, end: 19.5, open: 0.5 },
      { text: "al", start: 19.5, end: 19.875, open: 1 },
      { text: "tro ", start: 19.875, end: 20.25, open: 0.75 },
      { text: "me ", start: 20.25, end: 21, open: 0.75 },
      { text: "stes", start: 21, end: 21.75, open: 0.75 },
      { text: "so", start: 21.75, end: 23.25, open: 0.75 },
    ] },
    { start: 24, end: 30, syls: [
      { text: "vuo", start: 24, end: 24.375, open: 0.75 },
      { text: "le il ", start: 24.375, end: 24.75, open: 0.75 },
      { text: "mio ", start: 24.75, end: 25.5, open: 0.75 },
      { text: "be", start: 25.5, end: 25.875, open: 0.75 },
      { text: "ne, ", start: 25.875, end: 27, open: 0.75 },
      { text: "per ", start: 27, end: 27.375, open: 0.75 },
      { text: "a", start: 27.375, end: 27.75, open: 1 },
      { text: "mor ", start: 27.75, end: 28.5, open: 0.75 },
      { text: "mio", start: 28.5, end: 30, open: 0.75 },
    ] },
    { start: 30, end: 36, syls: [
      { text: "Un ", start: 30, end: 30.375, open: 0.5 },
      { text: "al", start: 30.375, end: 30.75, open: 1 },
      { text: "tro ", start: 30.75, end: 31.125, open: 0.75 },
      { text: "me ", start: 31.125, end: 31.5, open: 0.75 },
      { text: "stes", start: 31.5, end: 32.25, open: 0.75 },
      { text: "so! ", start: 32.25, end: 33, open: 0.75 },
      { text: "Un ", start: 33, end: 33.375, open: 0.5 },
      { text: "al", start: 33.375, end: 33.75, open: 1 },
      { text: "tro ", start: 33.75, end: 34.125, open: 0.75 },
      { text: "me ", start: 34.125, end: 34.5, open: 0.75 },
      { text: "stes", start: 34.5, end: 35.25, open: 0.75 },
      { text: "so!", start: 35.25, end: 36, open: 0.75 },
    ] },
    { start: 36, end: 42, syls: [
      { text: "e ", start: 36, end: 36.375, open: 0.75 },
      { text: "quel", start: 36.375, end: 36.75, open: 0.75 },
      { text: "l'a", start: 36.75, end: 37.125, open: 1 },
      { text: "mi", start: 37.125, end: 37.5, open: 0.5 },
      { text: "co, ", start: 37.5, end: 37.875, open: 0.75 },
      { text: "a", start: 37.875, end: 38.25, open: 1 },
      { text: "mi", start: 38.25, end: 38.625, open: 0.5 },
      { text: "co, ", start: 38.625, end: 39, open: 0.75 },
      { text: "sei ", start: 39, end: 39.375, open: 0.75 },
      { text: "tu", start: 39.375, end: 42, open: 0.5 },
    ] },
  ],
}

// The sound profiles this song is played in, and the voice styles of each with its audio.
export const AUDIO: Sounds = {
  plettro: {
    classico: 'audio/un-altro-me-stesso.m4a',
    avanzato: 'audio/un-altro-me-stesso-avanzato.m4a',
  },
  dita: {
    classico: 'audio/un-altro-me-stesso-dita.m4a',
    avanzato: 'audio/un-altro-me-stesso-dita-avanzato.m4a',
  },
}
