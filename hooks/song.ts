// Timing of audio/canzone.m4a, written by the script that rendered it:
// seconds from the start of the clip.
export type Syllable = { text: string; start: number; end: number; open: number }
export type Line = { start: number; end: number; syls: Syllable[] }
export type Song = {
  beat: number
  bar: number
  duration: number
  outroAt: number
  bloomAt: number
  finaleAt: number
  lines: Line[]
}

export const SONG: Song = {
  beat: 0.78947,
  bar: 3.15789,
  duration: 54.026,
  outroAt: 44.211,
  bloomAt: 25.263,
  finaleAt: 31.579,
  lines: [
    { start: 6.316, end: 12.632, syls: [
      { text: "So", start: 6.316, end: 6.711, open: 0.75 },
      { text: "no ", start: 6.711, end: 7.105, open: 0.75 },
      { text: "so", start: 7.105, end: 7.5, open: 0.75 },
      { text: "lo un ", start: 7.5, end: 7.895, open: 0.75 },
      { text: "Clau", start: 7.895, end: 9.079, open: 1 },
      { text: "de, ", start: 9.079, end: 9.474, open: 0.75 },
      { text: "ma ", start: 9.474, end: 9.868, open: 1 },
      { text: "sta", start: 9.868, end: 10.263, open: 1 },
      { text: "se", start: 10.263, end: 10.658, open: 0.75 },
      { text: "ra ", start: 10.658, end: 11.053, open: 1 },
      { text: "can", start: 11.053, end: 11.842, open: 1 },
      { text: "to", start: 11.842, end: 12.632, open: 0.75 },
    ] },
    { start: 12.632, end: 18.947, syls: [
      { text: "con ", start: 12.632, end: 13.026, open: 0.75 },
      { text: "un ", start: 13.026, end: 13.421, open: 0.5 },
      { text: "fio", start: 13.421, end: 13.816, open: 0.75 },
      { text: "re in ", start: 13.816, end: 14.211, open: 0.75 },
      { text: "ma", start: 14.211, end: 15, open: 1 },
      { text: "no, ", start: 15, end: 15.789, open: 0.75 },
      { text: "so", start: 15.789, end: 16.184, open: 0.75 },
      { text: "lo ", start: 16.184, end: 16.579, open: 0.75 },
      { text: "per ", start: 16.579, end: 17.368, open: 0.75 },
      { text: "te", start: 17.368, end: 18.947, open: 0.75 },
    ] },
    { start: 18.947, end: 25.263, syls: [
      { text: "qual", start: 18.947, end: 19.342, open: 1 },
      { text: "cu", start: 19.342, end: 19.737, open: 0.5 },
      { text: "no ", start: 19.737, end: 20.132, open: 0.75 },
      { text: "mi ha ", start: 20.132, end: 20.526, open: 1 },
      { text: "chie", start: 20.526, end: 21.316, open: 0.75 },
      { text: "sto ", start: 21.316, end: 21.711, open: 0.75 },
      { text: "di ", start: 21.711, end: 22.105, open: 0.5 },
      { text: "dir", start: 22.105, end: 22.895, open: 0.5 },
      { text: "te", start: 22.895, end: 23.289, open: 0.75 },
      { text: "lo ", start: 23.289, end: 23.684, open: 0.75 },
      { text: "pia", start: 23.684, end: 24.474, open: 1 },
      { text: "no", start: 24.474, end: 25.263, open: 0.75 },
    ] },
    { start: 25.263, end: 31.579, syls: [
      { text: "e ", start: 25.263, end: 25.658, open: 0.75 },
      { text: "can", start: 25.658, end: 26.447, open: 1 },
      { text: "to, ", start: 26.447, end: 26.842, open: 0.75 },
      { text: "e ", start: 26.842, end: 27.237, open: 0.75 },
      { text: "can", start: 27.237, end: 28.026, open: 1 },
      { text: "to, ", start: 28.026, end: 28.421, open: 0.75 },
      { text: "per ", start: 28.421, end: 28.816, open: 0.75 },
      { text: "que", start: 28.816, end: 29.211, open: 0.75 },
      { text: "sto ", start: 29.211, end: 29.605, open: 0.75 },
      { text: "fio", start: 29.605, end: 30, open: 0.75 },
      { text: "re ", start: 30, end: 30.395, open: 0.75 },
      { text: "che ", start: 30.395, end: 30.789, open: 0.75 },
      { text: "c'è", start: 30.789, end: 31.579, open: 0.75 },
    ] },
    { start: 31.579, end: 37.105, syls: [
      { text: "e ", start: 31.579, end: 31.974, open: 0.75 },
      { text: "can", start: 31.974, end: 33.158, open: 1 },
      { text: "to… ", start: 33.158, end: 33.947, open: 0.75 },
      { text: "e ", start: 34.737, end: 35.132, open: 0.75 },
      { text: "can", start: 35.132, end: 36.316, open: 1 },
      { text: "to…", start: 36.316, end: 37.105, open: 0.75 },
    ] },
    { start: 37.895, end: 44.211, syls: [
      { text: "per ", start: 37.895, end: 38.289, open: 0.75 },
      { text: "que", start: 38.289, end: 38.684, open: 0.75 },
      { text: "sto ", start: 38.684, end: 39.079, open: 0.75 },
      { text: "fio", start: 39.079, end: 39.474, open: 0.75 },
      { text: "re ", start: 39.474, end: 39.868, open: 0.75 },
      { text: "che ", start: 39.868, end: 40.263, open: 0.75 },
      { text: "c'è", start: 40.263, end: 44.211, open: 0.75 },
    ] },
  ],
}
