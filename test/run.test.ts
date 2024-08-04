import { describe, it, expect } from 'vitest'
import { join, resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { spawn, SpawnOptionsWithoutStdio } from 'node:child_process'
import strip from 'strip-comments'
import stripAnsi from 'strip-ansi'
import run from '../src/index'

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

describe('barrelly', () => {
    it('creates barrel files for flat folder structures', async () => {
        await run({
            path: './test/fixtures/simple',
            aliases: [],
            countExports: true,
            exportEverything: true,
            glob: '.ts',
            semi: false,
            silent: true
        })
        expect(await fileContentEqual('./test/fixtures/simple/index.ts', './test/expected-fixtures/simple.index.ts')).toBe(true)
    })

    it('creates barrel files for nested folder structures', async () => {
        await run({
            path: './test/fixtures/nested',
            aliases: [],
            countExports: true,
            exportEverything: true,
            glob: '.ts',
            semi: false,
            silent: true
        })
        expect(await fileContentEqual('./test/fixtures/nested/index.ts', './test/expected-fixtures/nested.root.index.ts')).toBe(true)
        expect(await fileContentEqual('./test/fixtures/nested/folder/index.ts', './test/expected-fixtures/nested.folder.index.ts')).toBe(true)
    })

    it('exports everything when a file has more than one export', async () => {
        await run({
            path: './test/fixtures/poly',
            aliases: [],
            countExports: true,
            exportEverything: true,
            glob: '.ts',
            semi: false,
            silent: true
        })
        expect(await fileContentEqual('./test/fixtures/poly/index.ts', './test/expected-fixtures/poly.index.ts')).toBe(true)
    })

    it('handles js files', async () => {
        await run({
            path: './test/fixtures/js',
            aliases: [],
            countExports: true,
            exportEverything: true,
            glob: '.js',
            semi: false,
            silent: true
        })
        expect(await fileContentEqual('./test/fixtures/js/index.js', './test/expected-fixtures/js.index.js')).toBe(true)
    })

    it('handles tsx files', async () => {
        await run({
            path: './test/fixtures/jsx',
            aliases: ['.tsx'],
            countExports: true,
            exportEverything: true,
            glob: '.tsx',
            semi: false,
            silent: true
        })
        expect(await fileContentEqual('./test/fixtures/jsx/index.ts', './test/expected-fixtures/jsx.index.ts')).toBe(true)
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
            expect(output).toContain('No barrel files were created')
        })
    })
})
