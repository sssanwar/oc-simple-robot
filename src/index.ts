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
  .then(async answers => {
    console.clear()
    const filepath = (answers.filepath as string) || 'commands.txt'
    const lines = await readInputFile(filepath)

    console.log()
    console.log('Starting game...')
    console.log()

    const initCommand = parseFirstLineCommand(lines[0])
    const robotCommands = parseSecondLineCommand(lines[1])

    const engine = new GameEngine(100, 100)
    engine.init(initCommand)

    console.log('')
    console.log('Movements:')

    engine.asObservable().subscribe(res => console.log(res.alias))
    robotCommands?.forEach(c => engine.sendCommand(c))
  })
  .catch(err => console.log(err))
