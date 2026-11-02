// The song being sung: `id` makes each run a fresh drawing.
export type Run = { id: number }

declare module 'claude-code' {
  interface PluginState {
    'serenata': { run: Run | null; isShown: boolean }
  }
}
