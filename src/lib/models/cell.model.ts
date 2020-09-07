import { Coordinate } from './types.model'

export class Cell {
  private _coordinate: Coordinate
  occupierId?: string

  constructor(x: number, y: number) {
    this._coordinate = { x: x, y: y }
  }

  get coordinate() {
    return this._coordinate
  }

  clear() {
    this.occupierId = undefined
  }
}
