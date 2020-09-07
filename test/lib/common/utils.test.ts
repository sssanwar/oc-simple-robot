import { repeatTask, wait, parseFirstLineCommand, parseSecondLineCommand } from '../../../src/lib/common/utils'
import { CompassPoint, ActionType } from '../../../src/lib/models/types.model'

describe('Utils tests', () => {
  it('waits', async () => {
    const start = new Date().getTime()
    await wait(210).then(() => {
      const diff = new Date().getTime() - start
      expect(diff).toBeGreaterThanOrEqual(200)
    })
  })

  it('repeats promise', async () => {
    let lastNumber = 0
    const p = () => Promise.resolve().then(() => lastNumber++)
    await repeatTask(5, p)
    expect(lastNumber).toEqual(5)
  })

  it('parses first command', () => {
    expect(parseFirstLineCommand('N 0 0')).toEqual({
      compassPoint: CompassPoint.N,
      position: { x: 0, y: 0 }
    })

    expect(parseFirstLineCommand('S 10 10')).toEqual({
      compassPoint: CompassPoint.S,
      position: { x: 10, y: 10 }
    })
  })

  it('parses second command', () => {
    const commands = parseSecondLineCommand('M1RM4L3M2')!
    expect(commands).toHaveLength(5)

    expect(commands[0].type).toEqual(ActionType.M)
    expect(commands[0].count).toEqual(1)

    expect(commands[1].type).toEqual(ActionType.R)
    expect(commands[1].count).toEqual(1)

    expect(commands[2].type).toEqual(ActionType.M)
    expect(commands[2].count).toEqual(4)
  })
})
