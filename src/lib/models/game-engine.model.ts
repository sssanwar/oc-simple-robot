import { WorldMap } from './world-map.model'
import { RobotCommand, InitCommand, ActionType, RotateDirection, CompassPoint, RobotLocation } from './types.model'
import shortid from 'shortid'
import { Robot } from './robot.model'
import { ObservableQueue } from '../common/observable-queue'

export class GameEngine {
  private _worldMap: WorldMap
  private _initDone = false
  private _commandQueue = new ObservableQueue<RobotLocation>()

  constructor(mapWidth: number, mapHeight: number) {
    this._worldMap = new WorldMap(mapWidth, mapHeight)
  }

  init(command: InitCommand) {
    const id = shortid()
    const robot = new Robot(id, this._worldMap, command.compassPoint)
    this._worldMap.put(robot, command.position)
    this._initDone = true
    console.log(`Robot created  : ${id}`)
    console.log(`Robot location : ${robot.positionString()}`)
  }

  sendCommand(command: RobotCommand) {
    if (!this._initDone) throw new Error('Engine not initialised yet.')
    this._commandQueue.add(this.processCommand(command))
  }

  asObservable() {
    return this._commandQueue.asObservable()
  }

  findRobot() {
    // This method only is for testing, in real world we would not need this.
    if (!this._initDone) throw new Error('Engine not initialised yet.')
    return this._worldMap.findFirstOccupier() as Robot
  }

  private processCommand(command: RobotCommand) {
    // Ideally we want to find by ID, but the sent command does not include IDs!
    const robot = (this._worldMap.findFirstOccupier() as Robot)!

    switch (command.type) {
      case ActionType.M:
        return robot.forward(command.count!)
      case ActionType.L:
        return robot.rotate(RotateDirection.L, command.count!)
      case ActionType.R:
        return robot.rotate(RotateDirection.R, command.count!)
      default:
        return Promise.resolve<RobotLocation>({
          compassPoint: CompassPoint.N,
          position: { x: -1, y: -1 },
          alias: 'Invalid RobotCommand Sent'
        })
    }
  }
}
