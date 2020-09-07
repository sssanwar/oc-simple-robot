import prompts from 'prompts'
import { GameEngine } from './lib/models/game-engine.model'
import { readInputFile } from './lib/common/file-utils'
import { parseFirstLineCommand, parseSecondLineCommand } from './lib/common/utils'

console.log('Reading commands...')

prompts([
  {
    type: 'text',
    name: 'filepath',
    message: 'Filepath (commands.txt)'
  }
])
  .then(answers => {
    const filepath = (answers.filepath as string) || 'commands.txt'
    console.clear()

    readInputFile(filepath).then((lines: string[]) => {
      console.log()
      console.log('Starting game...')
      console.log()

      const initCommand = parseFirstLineCommand(lines[0])
      const robotCommands = parseSecondLineCommand(lines[1])

      const engine = new GameEngine(100, 100)
      engine.init(initCommand)
      robotCommands?.forEach(c => engine.sendCommand(c))
    })
  })
  .catch(err => console.log(err))
