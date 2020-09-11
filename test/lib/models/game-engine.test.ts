import { GameEngine } from '../../../src/lib/models/game-engine.model'
import { parseCommandString } from '../../../src/lib/common/utils'
import { take, finalize } from 'rxjs/operators'
import { CompassPoint } from '../../../src/lib/models/types.model'
import { WorldMap } from '../../../src/lib/models/world-map.model'

describe('Game Engine tests', () => {
  let engine: GameEngine

  beforeAll(() => {
    const worldMap = new WorldMap(100, 100)
    engine = new GameEngine(worldMap)
  })

  it('runs commands correctly', done => {
    jest.setTimeout(30000)
    const cmdLines = parseCommandString(`N 0 0\nM1RM4L3M2`)
    let commandCount = 0
    let expCommandCount = cmdLines.second.reduce((tot, cmd) => (tot += cmd.count), 0) + 1

    engine
      .asObservable()
      .pipe(
        take(expCommandCount),
        finalize(() => {
          expect(commandCount).toEqual(expCommandCount)
          const robot = engine.findRobot()
          expect(robot.direction).toEqual(CompassPoint.S)
          expect(robot.position).toEqual({ x: 4, y: 99 })
          console.log(`Final commandCount: ${commandCount}`)
          return done()
        })
      )
      .subscribe(res => {
        commandCount++
        console.log(res)
      })

    expect(() => engine.sendCommand(cmdLines.second[0])).toThrowError(/not initialised/)

    engine.init(cmdLines.first)
    cmdLines.second.forEach(c => engine.sendCommand(c))
  })
})
