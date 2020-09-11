import { CompassPoint, ActionType, RobotCommand, InitCommand } from '../models/types.model'
import { from, of } from 'rxjs'
import { concatMap, map, finalize, delay, repeat, toArray, tap } from 'rxjs/operators'

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const translateCoordinate = (pos: number, max: number) => {
  if (pos < 0) return pos + max
  else if (pos >= max) return pos % max
  else return pos
}

export const repeatTask = <T>(count: number, task: () => Promise<T>, endWithFn?: () => void) => {
  return of(task).pipe(
    repeat(count),
    concatMap(p => from(p()).pipe(map(res => res))),
    finalize(() => endWithFn && endWithFn())
  )
}

const getEnumValByName = <T>(enumType: object, name: string): T => {
  return Object.values(enumType).find((x: string) => enumType[x] === name)
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
