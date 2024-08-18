import run from 'src'
import Command from './classes/Command'
import BarrellySchema from './schema'

const schema = new BarrellySchema().configFile('barrelly.config')

const cmd = new Command('barrelly', 'A tool to quickly generate all the barrel files you need based on the file structure of the project.', schema)
    .target('string', './src', 'path', 'Path to the folder of the entrypoint of the project.')
    .option('exportEverything', 'boolean', false, 'Exports everything from each found file. Only useful, if writing a package.')
    .option('glob', 'string', '.ts', 'Glob identifying all files to find.', 'glob')
    .option('semi', 'boolean', false, 'A style option to add a semicolon at the end of every line of each barrel file.')
    .option('aliases', 'string', [], "List of extensions to omit, because the project's package bundler already handles them.", 'extensions', true)
    .option('ignore', 'string', [], 'List of folders to ignore. This includes all their subfolders.', 'folder', true)
    .action(run)
await cmd.run()
