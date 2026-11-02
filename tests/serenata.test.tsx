import { expect, mock, test } from 'claude-code/testing'

const BAND = {
  plugin: 'serenata',
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 20,
    bodyColumns: 80,
    scroll: { offset: 0, bodyRows: 19 },
    view: {},
  },
} as const

test('Canta in the band plays the song and draws the stage', async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  const played: string[] = []
  on('audio.play', (_, e) => {
    played.push(String(e.clip.asset))

    return { value: undefined }
  })
  // On Windows the song plays through PowerShell's media player instead.
  on('process.spawn', async function* (_, e) {
    const command = e.argv.join(' ')
    if (command.includes('MediaPlayer') && command.includes('canzone.m4a')) played.push('audio/canzone.m4a')

    return { value: { code: 0, signal: null } }
  })

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  const stageOf = async () => (await ui.findAll({ type: 'Svg' })).map(svg => String(svg.props.source)).find(source => source.includes('<!-- run'))
  expect(await stageOf()).toBeUndefined()

  // The first song of a session waits for the surface to be ready.
  await ui.press({ key: 'sing' })
  await clock.advance(1000)
  expect(played).toEqual([])
  await clock.advance(300)
  expect(played).toEqual(['audio/canzone.m4a'])

  const stage = String(await stageOf())
  expect(stage).toContain('<!-- run 2200 -->')
  // No subtitles on the stage, the signature in its corner, the band's width.
  expect(stage).not.toContain('qualcuno')
  expect(stage).toContain('M2V-MDO')
  expect((await ui.findAll({ type: 'Svg' })).find(svg => String(svg.props.source).includes('<!-- run'))?.props.width).toBe(640)
  expect(stage.length).toBeLessThan(131072)

  // Ancora clears the stage, then draws a new one that starts from the beginning.
  await ui.press({ key: 'sing' })
  expect(await stageOf()).toBeUndefined()
  await clock.advance(200)
  expect(await stageOf()).toContain('<!-- run 2450 -->')
  expect(await ui.find({ key: 'stage-2450' })).toBeDefined()
  expect(played).toHaveLength(2)

  await ui.press({ key: 'stop' })
  expect(await stageOf()).toBeUndefined()
  await ui.unmount()
})

test('/serenata off hides the band and /serenata on brings it back', async ($, on) => {
  mock.clock(on)
  mock.store(on)
  // Nothing draws beneath the mod in a test: this hook stands for the engine.
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>engine</Text>
  })

  expect((await $.command.run({ command: 'serenata', args: 'off' })).text).toContain('spenta')
  const hidden = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await hidden.find({ key: 'sing' })).toBeUndefined()
  expect((await hidden.find({ type: 'Text' }))?.text).toBe('engine')
  await hidden.unmount()

  expect((await $.command.run({ command: 'serenata', args: 'on' })).text).toContain('accesa')
  const shown = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await shown.find({ key: 'sing' })).toBeDefined()
  await shown.unmount()
})

test('the terminal band offers the song in one row', async ($, on) => {
  mock.clock(on)

  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: /Claude canta/ })).toBeDefined()
  expect(await ui.find({ key: 'sing' })).toBeDefined()
  await ui.unmount()
})
