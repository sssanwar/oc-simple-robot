import { GameEngine } from '../../../src/lib/models/game-engine.model'
import { parseCommandString } from '../../../src/lib/common/utils'
import { take, finalize } from 'rxjs/operators'
import { CompassPoint, MapService } from '../../../src/lib/models/types.model'
import { WorldMap } from '../../../src/lib/models/world-map.model'
import { Robot } from '../../../src/lib/models/robot.model'

describe('Game Engine tests', () => {
  const worldMap: MapService = new WorldMap(100, 100)
  let engine: GameEngine

  beforeAll(() => {
    engine = new GameEngine(worldMap)
  })

  it('runs commands correctly', done => {
    jest.setTimeout(30000)
    const cmdLines = parseCommandString(`N 0 0\nM1RM4L3M2`)
    let commandCount = 0
    let expCommandCount = cmdLines.second.reduce((tot, cmd) => (tot += cmd.count), 0) + 1
    let robotId: string

    engine
      .asObservable()
      .pipe(
        take(expCommandCount),
        finalize(() => {
          expect(commandCount).toEqual(expCommandCount)
          const robot = worldMap.findOccupierById(robotId) as Robot
          expect(robot.direction).toEqual(CompassPoint.S)
          expect(robot.position).toEqual({ x: 4, y: 99 })
          console.log(`Final commandCount: ${commandCount}`)
          return done()
        })
      )
      .subscribe(res => {
        commandCount++
        robotId ??= res.id
        console.log(res.alias)
      })

    expect(() => engine.sendCommand(cmdLines.second[0])).toThrowError(/not initialised/)

    engine.init(cmdLines.first)
    cmdLines.second.forEach(c => engine.sendCommand(c))
  })
})
