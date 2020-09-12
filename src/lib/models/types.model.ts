export interface Coordinate {
  x: number
  y: number
}

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

export interface CompassData {
  point: CompassPoint
  degree: number
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
  R,
  NONE
}

export interface OccupierLocationData {
  id: string
  position: Coordinate
  footprints: Coordinate[]
}

export interface RobotLocationData extends OccupierLocationData {
  compassData: CompassData
  alias: string
}

export interface MapService {
  getFootprintCoordinates: (occupierId: string) => Coordinate[] | undefined
  findOccupierById: (occupierId: string) => Occupier | undefined
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
