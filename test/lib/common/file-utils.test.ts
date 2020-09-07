import { readInputFile } from '../../../src/lib/common/file-utils'

describe('File utils tests', () => {
  it('reads input file', async () => {
    const results = await readInputFile('commands.txt')
    expect(results[0]).toEqual('N 0 0')
    expect(results[1]).toEqual('M1RM4L3M2')
  })
})
