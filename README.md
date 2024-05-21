# barrelly

[![NPM license](https://img.shields.io/npm/l/barrelly.svg)](https://www.npmjs.com/package/barrelly)
[![NPM version](https://img.shields.io/npm/v/barrelly.svg)](https://www.npmjs.com/package/barrelly)
[![NPM downloads](https://img.shields.io/npm/dm/barrelly.svg)](http://www.npmtrends.com/barrelly)

Create barrel files faster than Donkey Kong can throw them!

With `barrely`, you can automatically generate barrel files for your whole folder structure.

## Installation

```powershell
pnpm i -D barrelly
```

You can even create a config file called `.barrellyrc`

## Usage

```powershell
barrelly "./src/**/*.ts"
```

Barelly is made for TypeScript in mind, but you can still run it for `js` files:

```powershell
barrelly -x ".js" "./src/**/*.ts"
```

## Options

### extensions

- Searches all files with named extensions
- Allows globs and the config file also allows arrays
- CLI: `-x` or `--extensions`
- **Default**: `.ts`

### countExports

- Will open every file as text file and read every export or module.exports statement to count them.
- Will write files with multiple exports as `export * from './A.ts'` in the barrel file
- **Default**: `true`
