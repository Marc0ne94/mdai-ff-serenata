// The song being sung: `id` makes each run a fresh drawing, `song` names the
// song it plays (an id from hooks/song.ts; absent in a run from before 0.2.0),
// `isOver` says its clip has ended (the stage keeps its last frame).
export type Run = { id: number; song?: string; isOver?: boolean }

declare module 'claude-code' {
  interface PluginState {
    // `songId`: the song picked in the menu or with /canta.
    // `voices`, `sounds`: the voice style and the sound profile picked for each song, by song id.
    // `lastSongs`: the song picked last in each collection, by collection id.
    // `showSettings`: whether the band shows its settings.
    'serenata': {
      run: Run | null
      isShown: boolean
      songId: string
      voices: Record<string, string>
      sounds: Record<string, string>
      lastSongs: Record<string, string>
      showSettings: boolean
    }
  }
}
