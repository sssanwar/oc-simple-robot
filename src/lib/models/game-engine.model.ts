import { RobotCommand, InitCommand, ActionType, RotateDirection, RobotLocationData, MapService } from './types.model'
import shortid from 'shortid'
import { Robot } from './robot.model'
import { ObservableQueue } from '../common/observable-queue'

export class GameEngine {
  private _mapService: MapService
  private _initDone = false
  private _commandQueue = new ObservableQueue<RobotLocationData>()
  private _robotId: string = 'none' // We shouldn't need this here...

  constructor(mapService: MapService) {
    this._mapService = mapService
  }

  init(command: InitCommand) {
    this._robotId = shortid()
    const robot = new Robot(this._robotId, this._mapService, command.compassPoint)
    this._mapService.put(robot, command.position)
    this._initDone = true
    console.log(`Robot created: ${this._robotId}`)
    this.sendCommand({ type: ActionType.NONE, id: this._robotId, count: 1 })
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
    return this._mapService.findOccupierById(this._robotId) as Robot
  }

  private processCommand(command: RobotCommand) {
    // We use temporary robotId because the sent command does not include IDs!
    const robot = (this._mapService.findOccupierById(command.id || this._robotId) as Robot)!

    switch (command.type) {
      case ActionType.M:
        return robot.forward(command.count!)
      case ActionType.L:
        return robot.rotate(RotateDirection.L, command.count!)
      case ActionType.R:
        return robot.rotate(RotateDirection.R, command.count!)
      default:
        return Promise.resolve<RobotLocationData>(robot.getPositionalData())
    }
  }
}
