import { CompassPoint, RotateDirection } from '../../../src/lib/models/types.model'
import { WorldMap } from '../../../src/lib/models/world-map.model'
import { Robot } from '../../../src/lib/models/robot.model'

describe('Robot Tests', () => {
  let worldMap: WorldMap

  beforeAll(() => {
    worldMap = new WorldMap(100, 100)
  })

  it('returns correct direction after creation and rotations', async () => {
    const robot = new Robot('R2-D2', worldMap, CompassPoint.S, 1)
    expect(robot.direction).toEqual(CompassPoint.S)

    await robot.rotate(RotateDirection.L, 1)
    expect(robot.direction).toEqual(CompassPoint.E)

    await robot.rotate(RotateDirection.R, 1)
    expect(robot.direction).toEqual(CompassPoint.S)

    await robot.rotate(RotateDirection.R, 2)
    expect(robot.direction).toEqual(CompassPoint.N)

    await robot.rotate(RotateDirection.R, 3)
    expect(robot.direction).toEqual(CompassPoint.W)
  })

  it('moves to the correct position after forward and reverse', async () => {
    const robot = new Robot('R2-D2', worldMap, 0, 1)
    expect(robot.direction).toEqual(CompassPoint.N)

    worldMap.put(robot, { x: 0, y: 0 })
    expect(robot.position).toEqual({ x: 0, y: 0 })

    await robot.forward(2)
    expect(robot.position).toEqual({ x: 0, y: 2 })

    await robot.reverse(2)
    expect(robot.position).toEqual({ x: 0, y: 0 })
  })

  it('has correct final position', async () => {
    worldMap = new WorldMap(100, 100)
    const robot = new Robot('R2-D2', worldMap, 0, 200)
    worldMap.put(robot, { x: 0, y: 0 })

    await robot.forward(1)
    expect(robot.position).toEqual({ x: 0, y: 1 })

    await robot.rotate(RotateDirection.R, 1)
    await robot.forward(4)
    await robot.rotate(RotateDirection.L, 3)
    await robot.forward(2)

    expect(robot.direction).toEqual(CompassPoint.S)
    expect(robot.position).toEqual({ x: 4, y: 99 })
  })
})
