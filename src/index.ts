import prompts from 'prompts'
import { GameEngine } from './lib/models/game-engine.model'
import { readInputFile } from './lib/common/file-utils'
import { parseFirstLineCommand, parseSecondLineCommand } from './lib/common/utils'
import { WorldMap } from './lib/models/world-map.model'

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

    const worldMap = new WorldMap(100, 100)
    const engine = new GameEngine(worldMap)

    engine.asObservable().subscribe(res => console.log(res.alias))
    engine.init(initCommand)

    console.log('')
    console.log('Movements:')

    robotCommands?.forEach(c => engine.sendCommand(c))
  })
  .catch(err => console.log(err))
