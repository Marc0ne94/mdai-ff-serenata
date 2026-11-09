// Written by tools/render.mjs from tools/songs/dipende-da-me.mjs: render again, do not edit.
// The timing is in seconds from the start of the audio, the same in every style.
// built 4a1d4ed2ef5ccc15c6081143024e247bb81c78144c7f4c031ed5ed703014c053
// source audio/dipende-da-me.m4a b2f61c8ac5d7de7f3ab1d651086a8fd6cfe454e083c24686918e72d366500fef 653cceb644e4fea22d894c427986856b93f799b28c09052875d6d6a2b46e8125
// source audio/dipende-da-me-avanzato.m4a d6caa567e4b76a548050e7803d9366e35c42b3b885d2ce00511d52eb33b40f4f 17bde082f14b69ee716446488c0aefb2a97dadaa3566ec2db251137444729267
// source audio/dipende-da-me-dita.m4a 04b9660ccfadd328a9b7aa7a38f8c19960f32550e8afbf6c3267c563af10e105 5d36732a839e6e9f5c7d24f9072728054d9412ccf4fad1ae1ee59f98baa309de
// source audio/dipende-da-me-dita-avanzato.m4a 3ef52b3c69d2ffea83d2b79ade135966f14605d2ef2c7cc9699d0c7ac4b8b45f 2547f897bd5e0a7d65aaa3962b2998579c6d844c0eeff4fe0ad03be023a4aa1e
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
    { start: 6, end: 11.625, syls: [
      { text: "Cer", start: 6, end: 6.375, open: 0.75 },
      { text: "te ", start: 6.375, end: 6.75, open: 0.75 },
      { text: "co", start: 6.75, end: 7.5, open: 0.75 },
      { text: "se ", start: 7.5, end: 7.875, open: 0.75 },
      { text: "di", start: 7.875, end: 8.25, open: 0.5 },
      { text: "pen", start: 8.25, end: 8.625, open: 0.75 },
      { text: "do", start: 8.625, end: 9, open: 0.75 },
      { text: "no ", start: 9, end: 9.375, open: 0.75 },
      { text: "da ", start: 9.375, end: 9.75, open: 1 },
      { text: "me", start: 9.75, end: 11.625, open: 0.75 },
    ] },
    { start: 12, end: 17.25, syls: [
      { text: "al", start: 12, end: 12.375, open: 1 },
      { text: "tre ", start: 12.375, end: 12.75, open: 0.75 },
      { text: "no, ", start: 12.75, end: 13.5, open: 0.75 },
      { text: "e ", start: 13.5, end: 13.875, open: 0.75 },
      { text: "va ", start: 13.875, end: 14.25, open: 1 },
      { text: "be", start: 14.25, end: 14.625, open: 0.75 },
      { text: "ne ", start: 14.625, end: 15, open: 0.75 },
      { text: "co", start: 15, end: 15.375, open: 0.75 },
      { text: "sì", start: 15.375, end: 17.25, open: 0.5 },
    ] },
    { start: 18, end: 23.25, syls: [
      { text: "il ", start: 18, end: 18.375, open: 0.5 },
      { text: "ven", start: 18.375, end: 18.75, open: 0.75 },
      { text: "to ", start: 18.75, end: 19.5, open: 0.75 },
      { text: "non ", start: 19.5, end: 19.875, open: 0.75 },
      { text: "lo ", start: 19.875, end: 20.25, open: 0.75 },
      { text: "scel", start: 20.25, end: 20.625, open: 0.75 },
      { text: "go ", start: 20.625, end: 21, open: 0.75 },
      { text: "i", start: 21, end: 21.375, open: 0.5 },
      { text: "o", start: 21.375, end: 23.25, open: 0.75 },
    ] },
    { start: 24, end: 30, syls: [
      { text: "scel", start: 24, end: 24.375, open: 0.75 },
      { text: "go il ", start: 24.375, end: 24.75, open: 0.75 },
      { text: "pen", start: 24.75, end: 25.5, open: 0.75 },
      { text: "sie", start: 25.5, end: 25.875, open: 0.75 },
      { text: "ro, ", start: 25.875, end: 27, open: 0.75 },
      { text: "scel", start: 27, end: 27.375, open: 0.75 },
      { text: "go ", start: 27.375, end: 27.75, open: 0.75 },
      { text: "la ", start: 27.75, end: 28.125, open: 1 },
      { text: "ve", start: 28.125, end: 28.5, open: 0.75 },
      { text: "la", start: 28.5, end: 30, open: 1 },
    ] },
    { start: 30, end: 36, syls: [
      { text: "Di", start: 30, end: 30.375, open: 0.5 },
      { text: "pen", start: 30.375, end: 30.75, open: 0.75 },
      { text: "de ", start: 30.75, end: 31.125, open: 0.75 },
      { text: "da ", start: 31.125, end: 31.5, open: 1 },
      { text: "me! ", start: 31.5, end: 32.625, open: 0.75 },
      { text: "Il ", start: 33, end: 33.375, open: 0.5 },
      { text: "re", start: 33.375, end: 33.75, open: 0.75 },
      { text: "sto ", start: 33.75, end: 34.5, open: 0.75 },
      { text: "no!", start: 34.5, end: 36, open: 0.75 },
    ] },
    { start: 36, end: 42, syls: [
      { text: "e ", start: 36, end: 36.375, open: 0.75 },
      { text: "la", start: 36.375, end: 36.75, open: 1 },
      { text: "scio ", start: 36.75, end: 37.125, open: 0.75 },
      { text: "il ", start: 37.125, end: 37.5, open: 0.5 },
      { text: "ven", start: 37.5, end: 38.25, open: 0.75 },
      { text: "to ", start: 38.25, end: 39, open: 0.75 },
      { text: "al ", start: 39, end: 39.375, open: 1 },
      { text: "ven", start: 39.375, end: 39.75, open: 0.75 },
      { text: "to", start: 39.75, end: 42, open: 0.75 },
    ] },
  ],
}

// The sound profiles this song is played in, and the voice styles of each with its audio.
export const AUDIO: Sounds = {
  plettro: {
    classico: 'audio/dipende-da-me.m4a',
    avanzato: 'audio/dipende-da-me-avanzato.m4a',
  },
  dita: {
    classico: 'audio/dipende-da-me-dita.m4a',
    avanzato: 'audio/dipende-da-me-dita-avanzato.m4a',
  },
}
