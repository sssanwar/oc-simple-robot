export type Coordinate = { x: number; y: number }

export interface Occupier {
  id: string
  width: number
  height: number
  position: Coordinate
}

export enum RotateDirection {
  L = -90,
  R = 90
}

export enum CompassPoint {
  N = 0,
  E = 90,
  S = 180,
  W = 270
}

export enum ActionType {
  M,
  L,
  R
}

export interface RobotLocation {
  compassPoint: CompassPoint
  position: Coordinate
  alias: string
}

export interface MapService {
  findPosition: (occupierId: string) => Coordinate | undefined
  put: (occupier: Occupier, position: Coordinate) => void
  clear: (occupier: Occupier) => void
}

export interface InitCommand {
  position: Coordinate
  compassPoint: CompassPoint
}

export interface RobotCommand {
  type: ActionType
  id?: string
  count: number
}
