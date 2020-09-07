import { CompassPoint, ActionType, RobotCommand, InitCommand } from '../models/types.model'
import { from } from 'rxjs'
import { concatMap, map, finalize } from 'rxjs/operators'

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const translateCoordinate = (pos: number, max: number) => {
  // Add 1 because we start from zero
  if (pos < 0) return pos + max + 1
  else if (pos > max) return pos % max
  else return pos
}

export const repeatTask = (repeat: number, task: () => Promise<any>, endWithFn?: () => void) =>
  from(new Array(repeat).fill(null).map(() => task()))
    .pipe(
      concatMap(p => from(p).pipe(map(() => void 0))),
      finalize(() => endWithFn && endWithFn())
    )
    .toPromise()

const getEnumValByName = <T>(enumType: any, name: string): T | undefined => {
  let keys = Object.values(enumType).filter((x: any) => enumType[x] === name)
  return keys.length > 0 ? (keys[0] as T) : undefined
}

export const parseFirstLineCommand = (input: string): InitCommand => {
  const tokens = input.trim().split(' ')
  return {
    compassPoint: getEnumValByName<CompassPoint>(CompassPoint, tokens[0])!,
    position: { x: Number(tokens[1]), y: Number(tokens[2]) }
  }
}

export const parseSecondLineCommand = (input: string): RobotCommand[] | undefined => {
  const matches = input.trim().match(/([A-Z]\d{0,3})/gi)
  return matches?.map(m => ({
    type: getEnumValByName<ActionType>(ActionType, m[0].toUpperCase())!,
    count: m.length > 1 ? Number(m.slice(1)) : 1
  }))
}

export const parseCommandString = (input: string) => {
  const lines = input.trim().split('\n')
  return { first: parseFirstLineCommand(lines[0]), second: parseSecondLineCommand(lines[1])! }
}
