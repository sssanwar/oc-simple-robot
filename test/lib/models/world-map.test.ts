import { WorldMap } from '../../../src/lib/models/world-map.model'
import { Robot } from '../../../src/lib/models/robot.model'

describe('Worldmap Tests', () => {
  beforeAll(() => {})

  it('calculates correct footprint', () => {
    const map = new WorldMap(100, 100)
    const cells = map.calculateFootprint(2, 2, { x: 0, y: 0 })
    expect(cells).toHaveLength(4)
    expect(cells.find(c => c.coordinate.x === 0 && c.coordinate.y === 0)).toBeTruthy()
    expect(cells.find(c => c.coordinate.x === 1 && c.coordinate.y === 1)).toBeTruthy()
    expect(cells.find(c => c.coordinate.x === 2 && c.coordinate.y === 0)).toBeFalsy()
  })

  it('can contain occupier', () => {
    const map = new WorldMap(10, 10)
    const robot = new Robot('A1', map)
    map.put(robot, { x: 3, y: 2 })

    const occupier = map.findOccupierById('A1')
    expect(occupier?.id).toEqual('A1')
    expect(map.findPosition('A1')).toEqual({ x: 3, y: 2 })
  })
})
