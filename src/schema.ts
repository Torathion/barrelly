import CLISchema from './classes/CLISchema'
import type { BarrellyOptions } from './types/interfaces'

export default class BarrellySchema extends CLISchema<BarrellyOptions> {
    constructor() {
        super(
            {
                aliases: [],
                exportEverything: false,
                glob: '.ts',
                path: './src',
                semi: false,
                ignore: []
            },
            'path'
        )
    }
}
