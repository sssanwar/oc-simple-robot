import { RotateDirection, CompassPoint, CompassData } from './types.model'
import { wait } from '../common/utils'

export class Compass {
  private _compassData: CompassData = { degree: 0, point: CompassPoint.N }
  private _delay: number

  constructor(compassPoint?: CompassPoint, delay?: number) {
    this._delay = delay || 0

    if (compassPoint) {
      this._compassData.degree = compassPoint as number
      this._compassData.point = compassPoint
    }
  }

  get compassData() {
    return this._compassData
  }

  async rotate(rotateDir: RotateDirection) {
    await wait(this._delay)
    const newDegree = this._compassData.degree + rotateDir
    this._compassData = {
      degree: newDegree,
      point: this.calculatePoint(newDegree)
    }
    return this._compassData
  }

  private calculatePoint(degree: number): CompassPoint {
    let compassPoint = degree % 360
    if (degree < 0) compassPoint = degree += 360
    return compassPoint
  }
}
