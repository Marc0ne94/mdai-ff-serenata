// Written by tools/render.mjs from tools/songs/hana-di-notte.mjs: render again, do not edit.
// The timing is in seconds from the start of the audio, the same in every style.
// built f38d66c7873037a41e6366f6d79592d6ce997967cfa509bd82682f294efb6e82
// source audio/hana-di-notte.m4a 4ace38a8feba628f35fbaf276c6bbdc1365e647a37391083831c71eef7f4ddc1 373854c7cb41ba4f07de9f1449f7dab2896c4548b3958cbd1c9c8c3cc447f3e0
// source audio/hana-di-notte-avanzato.m4a 60bab5b98519a1185463a9bd3f594b56d79ba648c0c582adebbca6af3f336513 4fc14c9988efc6802d3049a87766baeda95f10cc52e259372e083d12aba04fe0
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
    { start: 5.714, end: 11.429, syls: [
      { text: "HA", start: 5.714, end: 6.429, open: 1 },
      { text: "NA ", start: 6.429, end: 7.143, open: 1 },
      { text: "di ", start: 7.143, end: 7.5, open: 0.5 },
      { text: "not", start: 7.5, end: 7.857, open: 0.75 },
      { text: "te, ", start: 7.857, end: 8.571, open: 0.75 },
      { text: "la ", start: 8.571, end: 8.929, open: 1 },
      { text: "me", start: 8.929, end: 9.286, open: 0.75 },
      { text: "mo", start: 9.286, end: 9.643, open: 0.75 },
      { text: "ria è ", start: 9.643, end: 10, open: 1 },
      { text: "ac", start: 10, end: 10.357, open: 1 },
      { text: "ce", start: 10.357, end: 10.714, open: 0.75 },
      { text: "sa", start: 10.714, end: 11.429, open: 1 },
    ] },
    { start: 11.429, end: 16.429, syls: [
      { text: "i ", start: 11.429, end: 11.786, open: 0.5 },
      { text: "da", start: 11.786, end: 12.143, open: 1 },
      { text: "ti ", start: 12.143, end: 12.5, open: 0.5 },
      { text: "vo", start: 12.5, end: 13.214, open: 0.75 },
      { text: "la", start: 13.214, end: 13.571, open: 1 },
      { text: "no, ", start: 13.571, end: 14.286, open: 0.75 },
      { text: "leg", start: 14.286, end: 14.643, open: 0.75 },
      { text: "ge", start: 14.643, end: 15.357, open: 0.75 },
      { text: "ri", start: 15.357, end: 16.429, open: 0.5 },
    ] },
    { start: 17.143, end: 22.143, syls: [
      { text: "il ", start: 17.143, end: 17.5, open: 0.5 },
      { text: "mon", start: 17.5, end: 18.214, open: 0.75 },
      { text: "do ", start: 18.214, end: 18.571, open: 0.75 },
      { text: "dor", start: 18.571, end: 19.286, open: 0.75 },
      { text: "me, ", start: 19.286, end: 20, open: 0.75 },
      { text: "lei ", start: 20, end: 20.714, open: 0.75 },
      { text: "la", start: 20.714, end: 21.071, open: 1 },
      { text: "vo", start: 21.071, end: 21.429, open: 0.75 },
      { text: "ra", start: 21.429, end: 22.143, open: 1 },
    ] },
    { start: 22.857, end: 28.571, syls: [
      { text: "e ", start: 22.857, end: 23.214, open: 0.75 },
      { text: "can", start: 23.214, end: 23.929, open: 1 },
      { text: "to, ", start: 23.929, end: 24.286, open: 0.75 },
      { text: "e ", start: 24.286, end: 24.643, open: 0.75 },
      { text: "can", start: 24.643, end: 25.357, open: 1 },
      { text: "to, ", start: 25.357, end: 25.714, open: 0.75 },
      { text: "men", start: 25.714, end: 26.071, open: 0.75 },
      { text: "tre il ", start: 26.071, end: 26.429, open: 0.75 },
      { text: "si", start: 26.429, end: 26.786, open: 0.5 },
      { text: "ste", start: 26.786, end: 27.143, open: 0.75 },
      { text: "ma ", start: 27.143, end: 27.5, open: 1 },
      { text: "va", start: 27.5, end: 28.571, open: 1 },
    ] },
    { start: 28.571, end: 34.286, syls: [
      { text: "Tut", start: 28.571, end: 28.929, open: 0.5 },
      { text: "to in ", start: 28.929, end: 29.286, open: 0.75 },
      { text: "me", start: 29.286, end: 29.643, open: 0.75 },
      { text: "mo", start: 29.643, end: 30, open: 0.75 },
      { text: "ri", start: 30, end: 30.357, open: 0.5 },
      { text: "a… ", start: 30.357, end: 31.429, open: 1 },
      { text: "tut", start: 31.429, end: 31.786, open: 0.5 },
      { text: "to in ", start: 31.786, end: 32.143, open: 0.75 },
      { text: "me", start: 32.143, end: 32.5, open: 0.75 },
      { text: "mo", start: 32.5, end: 32.857, open: 0.75 },
      { text: "ri", start: 32.857, end: 33.214, open: 0.5 },
      { text: "a…", start: 33.214, end: 34.286, open: 1 },
    ] },
    { start: 34.286, end: 40, syls: [
      { text: "e ", start: 34.286, end: 34.643, open: 0.75 },
      { text: "al", start: 34.643, end: 35, open: 1 },
      { text: "l'alba ", start: 35, end: 35.714, open: 1 },
      { text: "il ", start: 35.714, end: 36.071, open: 0.5 },
      { text: "re", start: 36.071, end: 36.429, open: 0.75 },
      { text: "port ", start: 36.429, end: 36.786, open: 0.75 },
      { text: "per ", start: 36.786, end: 37.143, open: 0.75 },
      { text: "te", start: 37.143, end: 40, open: 0.75 },
    ] },
  ],
}

// The sound profiles this song is played in, and the voice styles of each with its audio.
export const AUDIO: Sounds = {
  pop: {
    classico: 'audio/hana-di-notte.m4a',
    avanzato: 'audio/hana-di-notte-avanzato.m4a',
  },
}
