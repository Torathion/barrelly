import { describe, it, expect } from 'vitest'
import { join, resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { spawn, SpawnOptionsWithoutStdio } from 'node:child_process'
import strip from 'strip-comments'
import stripAnsi from 'strip-ansi'
import run from '../src/index'
import { BarrellyOptions } from '../src/types/interfaces'

const cliPath = resolve(process.cwd(), './dist/cli.js')
const SpawnOptions: SpawnOptionsWithoutStdio = { stdio: 'pipe' }

function runCLI(args: string[]): Promise<{ output: string; code: number }> {
    return new Promise((resolve, reject) => {
        const cli = spawn('node', [cliPath, ...args], SpawnOptions)
        let output = ''
        cli.stdout.on('data', data => {
            output = `${output}${data}`
        })
        cli.stderr.on('data', data => {
            output = `${output}${data}`
        })
        cli.on('close', code => {
            resolve({ output: stripAnsi(output), code: code ?? 0 })
        })
        cli.on('error', error => {
            reject(error)
        })
    })
}

async function getTestFileContent(path: string): Promise<string> {
    return strip((await readFile(join(process.cwd(), path))).toString()).replace(/\s/g, '')
}

async function fileContentEqual(path: string, expectedPath: string): Promise<boolean> {
    return (await getTestFileContent(path)) === (await getTestFileContent(expectedPath))
}

const NoOutputText = 'No barrel files were created'
const defaultOpts: Partial<BarrellyOptions> = {
    aliases: [],
    ignore: [],
    exportEverything: true,
    glob: '.ts',
    semi: false,
    silent: true
}

describe('barrelly', () => {
    it('creates barrel files for flat folder structures', async () => {
        await run({
            ...defaultOpts,
            path: './test/fixtures/simple'
        } as BarrellyOptions)
        expect(await fileContentEqual('./test/fixtures/simple/index.ts', './test/expected-fixtures/simple.index.ts')).toBe(true)
    })

    it('creates barrel files for nested folder structures', async () => {
        await run({
            ...defaultOpts,
            path: './test/fixtures/nested'
        } as BarrellyOptions)
        expect(await fileContentEqual('./test/fixtures/nested/index.ts', './test/expected-fixtures/nested.root.index.ts')).toBe(true)
        expect(await fileContentEqual('./test/fixtures/nested/folder/index.ts', './test/expected-fixtures/nested.folder.index.ts')).toBe(true)
    })

    it('exports everything when a file has more than one export', async () => {
        await run({
            ...defaultOpts,
            path: './test/fixtures/poly'
        } as BarrellyOptions)
        expect(await fileContentEqual('./test/fixtures/poly/index.ts', './test/expected-fixtures/poly.index.ts')).toBe(true)
    })

    it('handles js files', async () => {
        await run({
            ...defaultOpts,
            path: './test/fixtures/js',
            glob: '.js'
        } as BarrellyOptions)
        expect(await fileContentEqual('./test/fixtures/js/index.js', './test/expected-fixtures/js.index.js')).toBe(true)
    })

    it('handles tsx files', async () => {
        await run({
            ...defaultOpts,
            path: './test/fixtures/jsx',
            aliases: ['.tsx'],
            glob: '.tsx'
        } as BarrellyOptions)
        expect(await fileContentEqual('./test/fixtures/jsx/index.ts', './test/expected-fixtures/jsx.index.ts')).toBe(true)
    })

    it('separates default export and other exports, if the export count is higher than one', async () => {
        await run({
            ...defaultOpts,
            path: './test/fixtures/double-line'
        } as BarrellyOptions)
        expect(await fileContentEqual('./test/fixtures/double-line/index.ts', './test/expected-fixtures/double-line.index.ts')).toBe(true)
    })

    it('writes a poly export for a single normal export', async () => {
        await run({
            ...defaultOpts,
            path: './test/fixtures/single-normal'
        } as BarrellyOptions)
        expect(await fileContentEqual('./test/fixtures/single-normal/index.ts', './test/expected-fixtures/single-normal.index.ts')).toBe(true)
    })

    it('it wont add duplicate entries from the same tree node', async () => {
        await run({
            ...defaultOpts,
            path: './test/fixtures/duplicate-line'
        } as BarrellyOptions)
        expect(await fileContentEqual('./test/fixtures/duplicate-line/index.ts', './test/expected-fixtures/duplicate-line.index.ts')).toBe(true)
    })

    it('wont crash when occurring some empty folders', async () => {
        await run({
            ...defaultOpts,
            path: './test/fixtures/empty-folders-with-exports'
        } as BarrellyOptions)
        expect(
            await fileContentEqual(
                './test/fixtures/empty-folders-with-exports/index.ts',
                './test/expected-fixtures/empty-folders-with-exports.index.ts'
            )
        ).toBe(true)
    })

    it('can ignore folders', async () => {
        await run({
            ...defaultOpts,
            path: './test/fixtures/partial-ignore',
            ignore: ['./test/fixtures/partial-ignore/ignore']
        } as BarrellyOptions)
        expect(await fileContentEqual('./test/fixtures/partial-ignore/index.ts', './test/expected-fixtures/partial-ignore.index.ts')).toBe(true)
    })

    describe('command', () => {
        it('can show the version', async () => {
            const { output, code } = await runCLI(['barrelly', '-v'])
            expect(code).toBe(0)
            expect(output).toContain('barrelly')
            expect(output).toContain('Version')
        })

        it('can show the help text', async () => {
            const { output, code } = await runCLI(['barrelly', '-h'])
            expect(code).toBe(0)
            expect(output).toContain('barrelly')
            expect(output).toContain('Version')
            expect(output).toContain('Options')
            expect(output).toContain('--no-semi')
            expect(output).toContain('--silent')
        })

        it('can run', async () => {
            const { output, code } = await runCLI(['barrelly', './test/fixtures/simple', '-e'])
            expect(code).toBe(0)
            expect(output).toContain('Finished creating barrel')
        })

        it('can run with aliases', async () => {
            const { output, code } = await runCLI(['barrelly', '-e', '-g', '.tsx', '-a', '.tsx .jsx'])
            expect(code).toBe(0)
            expect(output).toContain(NoOutputText)
        })

        it('emits a warning if a duplicate line was found on the same tree node', async () => {
            const { output, code } = await runCLI(['barrelly', './test/fixtures/duplicate-line', '-e'])
            expect(code).toBe(0)
            expect(output).toContain('Duplicate export line')
        })

        it('does nothing, if there were no exports founds', async () => {
            const { output, code } = await runCLI(['barrelly', './test/fixtures/empty-folders', '-e'])
            expect(code).toBe(0)
            expect(output).toContain(NoOutputText)
        })

        it('does nothing, if the root folder is ignored', async () => {
            const { output, code } = await runCLI(['barrelly', '-i', './src'])
            expect(code).toBe(0)
            expect(output).toContain(NoOutputText)
        })

        it('does nothing, if everything is ignored', async () => {
            const { output, code } = await runCLI(['barrelly', './test/fixtures/ignore-everything', '-i', './test/fixtures/ignore-everything/ignore'])
            expect(code).toBe(0)
            expect(output).toContain(NoOutputText)
        })
    })
})
