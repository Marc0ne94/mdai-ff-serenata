// Written by tools/render.mjs from tools/songs/go-live.mjs: render again, do not edit.
// The timing is in seconds from the start of the audio, the same in every style.
// built dd50405aecc0b3dcfd8d0e8e8e427617c4cb34d0f9ee3a61245f9f1535bba955
// source audio/go-live.m4a ee547d2a2e4f34eaf8c72fa862a319cd5d3e1fab39b5b3dc99a46765ebfc0c9b d1623d73e7ab421b05493b3229b659d21f7ba2253be6a5983ef0235310c3942d
// source audio/go-live-avanzato.m4a ed1c272f2177b338ae163588bcb1e452fec08f5f301ffee0ea53ccf940550386 2547986d29ca5351fccc248011e70ac1cd008d1461766964764e113e5faa7a27
import type { Sounds, Timing } from '../song'

export const TIMING: Timing = {
  bpm: 84,
  beat: 0.71429,
  bar: 2.85714,
  duration: 49.214,
  outroAt: 40,
  bloomAt: 22.857,
  finaleAt: 28.571,
  lines: [
    { start: 5.714, end: 11.071, syls: [
      { text: "Go-", start: 5.714, end: 6.071, open: 0.75 },
      { text: "li", start: 6.071, end: 6.429, open: 0.5 },
      { text: "ve, ", start: 6.429, end: 7.143, open: 0.75 },
      { text: "go-", start: 7.143, end: 7.5, open: 0.75 },
      { text: "li", start: 7.5, end: 7.857, open: 0.5 },
      { text: "ve, ", start: 7.857, end: 8.571, open: 0.75 },
      { text: "sta", start: 8.571, end: 8.929, open: 1 },
      { text: "not", start: 8.929, end: 9.286, open: 0.75 },
      { text: "te ", start: 9.286, end: 9.643, open: 0.75 },
      { text: "si ", start: 9.643, end: 10, open: 0.5 },
      { text: "va", start: 10, end: 11.071, open: 1 },
    ] },
    { start: 11.429, end: 16.429, syls: [
      { text: "dal ", start: 11.429, end: 11.786, open: 1 },
      { text: "DEV ", start: 11.786, end: 12.5, open: 0.75 },
      { text: "al ", start: 12.5, end: 12.857, open: 1 },
      { text: "QAS ", start: 12.857, end: 13.571, open: 1 },
      { text: "e ", start: 13.571, end: 13.929, open: 0.75 },
      { text: "poi ", start: 13.929, end: 14.286, open: 0.75 },
      { text: "pro", start: 14.286, end: 14.643, open: 0.75 },
      { text: "du", start: 14.643, end: 15, open: 0.5 },
      { text: "zio", start: 15, end: 15.357, open: 0.75 },
      { text: "ne", start: 15.357, end: 16.429, open: 0.75 },
    ] },
    { start: 17.143, end: 22.857, syls: [
      { text: "il ", start: 17.143, end: 17.5, open: 0.5 },
      { text: "cli", start: 17.5, end: 17.857, open: 0.5 },
      { text: "en", start: 17.857, end: 18.214, open: 0.75 },
      { text: "te ", start: 18.214, end: 18.571, open: 0.75 },
      { text: "al ", start: 18.571, end: 18.929, open: 1 },
      { text: "te", start: 18.929, end: 19.286, open: 0.75 },
      { text: "le", start: 19.286, end: 19.643, open: 0.75 },
      { text: "fo", start: 19.643, end: 20, open: 0.75 },
      { text: "no: ", start: 20, end: 20.357, open: 0.75 },
      { text: "al", start: 20.357, end: 20.714, open: 1 },
      { text: "lo", start: 20.714, end: 21.071, open: 0.75 },
      { text: "ra, ", start: 21.071, end: 21.429, open: 1 },
      { text: "va?", start: 21.429, end: 22.857, open: 1 },
    ] },
    { start: 22.857, end: 28.571, syls: [
      { text: "e ", start: 22.857, end: 23.214, open: 0.75 },
      { text: "can", start: 23.214, end: 23.929, open: 1 },
      { text: "to, ", start: 23.929, end: 24.286, open: 0.75 },
      { text: "e ", start: 24.286, end: 24.643, open: 0.75 },
      { text: "can", start: 24.643, end: 25.357, open: 1 },
      { text: "to, ", start: 25.357, end: 25.714, open: 0.75 },
      { text: "tut", start: 25.714, end: 26.071, open: 0.5 },
      { text: "to ", start: 26.071, end: 26.429, open: 0.75 },
      { text: "ver", start: 26.429, end: 27.143, open: 0.75 },
      { text: "de ", start: 27.143, end: 27.5, open: 0.75 },
      { text: "or", start: 27.5, end: 27.857, open: 0.75 },
      { text: "mai", start: 27.857, end: 28.571, open: 1 },
    ] },
    { start: 28.571, end: 34.286, syls: [
      { text: "Go-", start: 28.571, end: 28.929, open: 0.75 },
      { text: "li", start: 28.929, end: 29.286, open: 0.5 },
      { text: "ve! ", start: 29.286, end: 30.357, open: 0.75 },
      { text: "Go-", start: 30.714, end: 31.071, open: 0.75 },
      { text: "li", start: 31.071, end: 31.429, open: 0.5 },
      { text: "ve! ", start: 31.429, end: 32.5, open: 0.75 },
      { text: "È ", start: 32.857, end: 33.214, open: 0.75 },
      { text: "an", start: 33.214, end: 33.571, open: 1 },
      { text: "da", start: 33.571, end: 33.929, open: 1 },
      { text: "ta!", start: 33.929, end: 34.286, open: 1 },
    ] },
    { start: 34.286, end: 40, syls: [
      { text: "e ", start: 34.286, end: 34.643, open: 0.75 },
      { text: "do", start: 34.643, end: 35, open: 0.75 },
      { text: "ma", start: 35, end: 35.357, open: 1 },
      { text: "ni, ", start: 35.357, end: 35.714, open: 0.5 },
      { text: "caf", start: 35.714, end: 36.429, open: 1 },
      { text: "fè ", start: 36.429, end: 37.143, open: 0.75 },
      { text: "con ", start: 37.143, end: 37.5, open: 0.75 },
      { text: "te", start: 37.5, end: 40, open: 0.75 },
    ] },
  ],
}

// The sound profiles this song is played in, and the voice styles of each with its audio.
export const AUDIO: Sounds = {
  pop: {
    classico: 'audio/go-live.m4a',
    avanzato: 'audio/go-live-avanzato.m4a',
  },
}
