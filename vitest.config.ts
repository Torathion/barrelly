import { defineConfig } from 'vitest/config'

if (process.env.TEST_WATCH) {
    // Patch stdin on the process so that we can fake it to seem like a real interactive terminal and pass the TTY checks
    process.stdin.isTTY = true
    process.stdin.setRawMode = () => process.stdin
}

const isCI = process.env.CI === 'true'

export default defineConfig({
    esbuild: {
        target: 'es2022',
        include: /\.(m?[jt]s|[jt]sx)$/,
        exclude: []
    },
    test: {
        coverage: {
            enabled: true,
            all: true,
            lines: 60,
            branches: 60,
            functions: 60,
            statements: 60,
            provider: 'v8',
            exclude: [
                'eslint.config.js',
                'esbuild.config.js',
                '**/*.d.ts',
                '**/*/types.ts',
                '**/*/fixtures',
                '**/*/expected-fixtures',
                '**/*/interfaces.ts',
                './test/**/*.ts'
            ],
            reporter: ['text', 'text-summary', 'json', 'json-summary', 'html']
        },
        testTimeout: 10000,
        reporters: isCI ? ['verbose', 'json', 'junit'] : ['default', 'hanging-process'],
        outputFile: {
            json: './test-results/test-results.json',
            junit: './test-results/test-results.xml'
        },
        benchmark: {
            reporters: isCI ? ['verbose', 'json'] : 'default',
            outputFile: './test-results/benchmark-results.json'
        },
        silent: isCI
    }
})
