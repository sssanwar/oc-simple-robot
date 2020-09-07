import { GameEngine } from '../../../src/lib/models/game-engine.model'
import { parseCommandString } from '../../../src/lib/common/utils'
import { take, finalize, map } from 'rxjs/operators'
import { CompassPoint } from '../../../src/lib/models/types.model'

describe('Game Engine tests', () => {
  let engine: GameEngine

  beforeAll(() => {
    engine = new GameEngine(100, 100)
  })

  it('runs commands correctly', done => {
    jest.setTimeout(10000)
    let commandCount = 0
    const cmdLines = parseCommandString(`N 0 0\nM1RM4L3M2`)

    engine
      .asObservable()
      .pipe(
        take(cmdLines.second.length),
        finalize(() => {
          expect(commandCount).toEqual(cmdLines.second.length)
          const robot = engine.findRobot()
          expect(robot.direction).toEqual(CompassPoint.S)
          expect(robot.position).toEqual({ x: 4, y: 99 })
          return done()
        })
      )
      .subscribe(res => {
        commandCount++
        console.log(res.alias)
      })

    expect(() => engine.sendCommand(cmdLines.second[0])).toThrowError(/not initialised/)

    engine.init(cmdLines.first)
    cmdLines.second.forEach(c => engine.sendCommand(c))
  })
})
