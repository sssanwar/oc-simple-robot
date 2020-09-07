import { Occupier, CompassPoint, RotateDirection, Coordinate, MapService } from './types.model'
import { Compass } from './compass.model'
import { wait, repeatTask } from '../common/utils'

export class Robot implements Occupier {
  private _compass: Compass
  private _mapService: MapService
  private _delay: number = 0 // in milliseconds
  id: string
  width: number = 1
  height: number = 1

  constructor(id: string, mapService: MapService, direction?: CompassPoint, delay?: number) {
    this.id = id
    this._mapService = mapService
    this._compass = new Compass(direction, delay)
    if (delay) this._delay = delay
  }

  get position(): Coordinate {
    return this._mapService.findPosition(this.id)!
  }

  get direction() {
    return this._compass.point
  }

  forward(steps: number) {
    return repeatTask(steps, () => this.move())
  }

  reverse(steps: number) {
    return repeatTask(steps, () => this.move(true))
  }

  rotate(rotateDir: RotateDirection, count: number) {
    return repeatTask(count, async () => {
      await this._compass.rotate(rotateDir)
      return { compassPoint: this.direction, position: this.position, alias: this.positionString() }
    })
  }

  positionString() {
    const pos = this.position ? `${this.position.x} ${this.position.y}` : '- -'
    return `${CompassPoint[this.direction]} ${pos}`
  }

  private async move(isReverse?: boolean) {
    await wait(this._delay)
    const projectedPos = this.projectMovePos(isReverse)
    this._mapService.clear(this)
    this._mapService.put(this, projectedPos)
    return { compassPoint: this.direction, position: this.position, alias: this.positionString() }
  }

  private projectMovePos(isReverse?: boolean): Coordinate {
    const sigFlag = isReverse ? -1 : 1
    let xStep = 0
    let yStep = 0

    switch (this.direction) {
      case CompassPoint.N:
        yStep = 1 * sigFlag
        break
      case CompassPoint.E:
        xStep = 1 * sigFlag
        break
      case CompassPoint.S:
        yStep = -1 * sigFlag
        break
      case CompassPoint.W:
        xStep = -1 * sigFlag
        break
    }

    let currentPos = this.position
    return { x: currentPos.x + xStep, y: currentPos.y + yStep }
  }
}
