import { Compass } from '../../../src/lib/models/compass.model'
import { CompassPoint, RotateDirection } from '../../../src/lib/models/types.model'

describe('Compass Tests', () => {
  it('returns correct direction after rotations', async () => {
    const compass = new Compass(CompassPoint.W)
    expect(compass.point).toEqual(CompassPoint.W)

    await compass.rotate(RotateDirection.R)
    expect(compass.point).toEqual(CompassPoint.N)

    await compass.rotate(RotateDirection.R)
    expect(compass.point).toEqual(CompassPoint.E)

    await compass.rotate(RotateDirection.L)
    await compass.rotate(RotateDirection.L)
    expect(compass.point).toEqual(CompassPoint.W)
  })
})
