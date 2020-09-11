import fs from 'fs'
import readline from 'readline'

const readFileInterface = (filepath: string) =>
  readline.createInterface(fs.createReadStream(filepath), process.stdout, undefined, false)

export const readInputFile = async (filepath: string) => {
  const lines: string[] = []
  let lineCount = 0

  return await new Promise<string[]>(resolve => {
    readFileInterface(filepath)
      .on('line', line => {
        lines.push(line)
        lineCount++
        console.log(`Line ${lineCount}: ${line}`)
      })
      .on('close', () => resolve(lines))
  })
}
