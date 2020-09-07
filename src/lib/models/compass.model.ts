import { RotateDirection, CompassPoint } from './types.model'
import { wait } from '../common/utils'

export class Compass {
  private _pointDegree: number = 0
  private _delay = 0

  constructor(compassPoint?: CompassPoint, delay?: number) {
    if (compassPoint) this._pointDegree = compassPoint as number
    if (delay) this._delay = delay
  }

  async rotate(rotateDir: RotateDirection) {
    await wait(this._delay)
    this._pointDegree += rotateDir
    if (this._pointDegree > 360) this._pointDegree %= 360
    else if (this._pointDegree < 0) this._pointDegree += 360
    else if (this._pointDegree === 360) this._pointDegree = 0
  }

  get point(): CompassPoint {
    return this._pointDegree as CompassPoint
  }
}
