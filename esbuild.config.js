import { build } from 'esbuild'

await build({
    entryPoints: ['./src/index.ts', './src/cli.ts'],
    bundle: true,
    minify: false,
    platform: 'node',
    sourcemap: false,
    outdir: '/dist',
    format: 'esm',
    target: 'es2022',
    logLevel: 'info',
    packages: 'external'
}).catch(err => {
    console.error(err)
})
