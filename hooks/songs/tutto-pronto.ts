// Written by tools/render.mjs from tools/songs/tutto-pronto.mjs: render again, do not edit.
// The timing is in seconds from the start of the audio, the same in every style.
// built d603090821c9accbcfa1a2d3ba6c2b7546a6c08a1f52d7b968ddf2a47af62a20
// source audio/tutto-pronto.m4a 21f9e608349ffd1a637e815fd8203342d5a57c819d62497117ec70581305ada6 65a545c608a260c0fad028ee7f25ce47efa6093952a909d878ef3e76883ffa70
import type { Sounds, Timing } from '../song'

export const TIMING: Timing = {
  bpm: 92,
  beat: 0.65217,
  bar: 2.6087,
  duration: 45.239,
  outroAt: 36.522,
  bloomAt: 20.87,
  finaleAt: 26.087,
  lines: [
    { start: 5.217, end: 9.783, syls: [
      { text: "Tut", start: 5.217, end: 5.543, open: 0.5 },
      { text: "to è ", start: 5.543, end: 5.87, open: 0.75 },
      { text: "pron", start: 5.87, end: 6.522, open: 0.75 },
      { text: "to, ", start: 6.522, end: 7.174, open: 0.75 },
      { text: "tut", start: 7.174, end: 7.5, open: 0.5 },
      { text: "to è ", start: 7.5, end: 7.826, open: 0.75 },
      { text: "fat", start: 7.826, end: 8.478, open: 1 },
      { text: "to", start: 8.478, end: 9.783, open: 0.75 },
    ] },
    { start: 10.435, end: 15, syls: [
      { text: "e il ", start: 10.435, end: 10.761, open: 0.75 },
      { text: "co", start: 10.761, end: 11.087, open: 0.75 },
      { text: "di", start: 11.087, end: 11.413, open: 0.5 },
      { text: "ce è ", start: 11.413, end: 11.739, open: 0.75 },
      { text: "pu", start: 11.739, end: 12.065, open: 0.5 },
      { text: "li", start: 12.065, end: 13.043, open: 0.5 },
      { text: "to", start: 13.043, end: 15, open: 0.75 },
    ] },
    { start: 15.652, end: 20.217, syls: [
      { text: "o", start: 15.652, end: 15.978, open: 0.75 },
      { text: "ra ", start: 15.978, end: 16.304, open: 1 },
      { text: "ri", start: 16.304, end: 16.63, open: 0.5 },
      { text: "po", start: 16.63, end: 17.283, open: 0.75 },
      { text: "sa, ", start: 17.283, end: 17.935, open: 1 },
      { text: "a", start: 17.935, end: 18.261, open: 1 },
      { text: "mi", start: 18.261, end: 18.587, open: 0.5 },
      { text: "co ", start: 18.587, end: 18.913, open: 0.75 },
      { text: "mio", start: 18.913, end: 20.217, open: 0.75 },
    ] },
    { start: 20.87, end: 26.087, syls: [
      { text: "e ", start: 20.87, end: 21.196, open: 0.75 },
      { text: "can", start: 21.196, end: 21.848, open: 1 },
      { text: "to, ", start: 21.848, end: 22.174, open: 0.75 },
      { text: "e ", start: 22.174, end: 22.5, open: 0.75 },
      { text: "can", start: 22.5, end: 23.152, open: 1 },
      { text: "to, ", start: 23.152, end: 23.478, open: 0.75 },
      { text: "per ", start: 23.478, end: 23.804, open: 0.75 },
      { text: "te ", start: 23.804, end: 24.13, open: 0.75 },
      { text: "che ", start: 24.13, end: 24.457, open: 0.75 },
      { text: "ci ", start: 24.457, end: 24.783, open: 0.5 },
      { text: "sei", start: 24.783, end: 26.087, open: 0.75 },
    ] },
    { start: 26.087, end: 30.652, syls: [
      { text: "Tut", start: 26.087, end: 26.413, open: 0.5 },
      { text: "to è ", start: 26.413, end: 26.739, open: 0.75 },
      { text: "fat", start: 26.739, end: 27.391, open: 1 },
      { text: "to! ", start: 27.391, end: 28.043, open: 0.75 },
      { text: "tut", start: 28.696, end: 29.022, open: 0.5 },
      { text: "to è ", start: 29.022, end: 29.348, open: 0.75 },
      { text: "pron", start: 29.348, end: 30, open: 0.75 },
      { text: "to!", start: 30, end: 30.652, open: 0.75 },
    ] },
    { start: 31.304, end: 36.522, syls: [
      { text: "e ", start: 31.304, end: 31.63, open: 0.75 },
      { text: "a", start: 31.63, end: 31.957, open: 1 },
      { text: "des", start: 31.957, end: 32.283, open: 0.75 },
      { text: "so ", start: 32.283, end: 32.609, open: 0.75 },
      { text: "can", start: 32.609, end: 33.261, open: 1 },
      { text: "to ", start: 33.261, end: 33.913, open: 0.75 },
      { text: "per ", start: 33.913, end: 34.239, open: 0.75 },
      { text: "te", start: 34.239, end: 36.522, open: 0.75 },
    ] },
  ],
}

// The sound profiles this song is played in, and the voice styles of each with its audio.
export const AUDIO: Sounds = {
  pop: {
    classico: 'audio/tutto-pronto.m4a',
  },
}
