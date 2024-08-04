# barrelly

[![NPM license](https://img.shields.io/npm/l/barrelly.svg)](https://www.npmjs.com/package/barrelly)
[![NPM version](https://img.shields.io/npm/v/barrelly.svg)](https://www.npmjs.com/package/barrelly)
[![NPM downloads](https://img.shields.io/npm/dm/barrelly.svg)](http://www.npmtrends.com/barrelly)

Create barrel files faster than Donkey Kong can throw them!

With `barrelly`, you can automatically generate barrel files for your whole project in under a second!

## Installation

```powershell
pnpm i -D barrelly
```

## Usage

Using barrelly on this project (1.0.0):

```powershell
barrelly ./src
```

Will print:

```powershell
┌─────────┬───────────────┬──────┐
│  action │        folder │ size │
├─────────┼───────────────┼──────┤
│ created │      utils/fs │ 416b │
│ created │         utils │ 298b │
│ created │         tasks │ 284b │
│ created │     utils/git │ 245b │
│ created │  utils/guards │ 233b │
│ created │       classes │ 173b │
│ created │  utils/string │ 119b │
│ created │         types │  52b │
│ created │    utils/path │  50b │
│ created │ utils/process │  46b │
│ created │    structures │  22b │
└─────────┴───────────────┴──────┘

Finished creating barrel files after 38ms!
```

Barrelly can map any kind of files as long as they follow the ESM `default`-`export` syntax. (.ts, .js, .jsx, .tsx, ...)

#### For JS

```powershell
barrelly ./src -g .js
```

#### For TSX

```powershell
barrelly ./src -g .tsx -a .tsx
```

## Options

### aliases (-a)

-   List of aliases handles by the bundler
-   Those extensions will be omitted inside the barrel file.
-   **Default**: `[]`

### countExports (-c)

-   Will open every file as text file and read every export or module.exports statement to count them.
-   Will write files with multiple exports as `export * from './<file>.ts'` inside the barrel file
-   **Default**: `true`

### exportEverything (-e)

-   Flag indicating whether everything should be exported from the target folder.
-   Necessary for libraries to ensure everything that should be exported will be exported.
-   Useful for sub folders to reduce the lines of code (LOC) when importing the code.
-   **Default**: `false`

### glob (-g)

-   Glob describing all the file extensions to search for.
-   **Default**: `.ts`

### path (target)

-   The path of the target folder, which acts as the root folder for the barrel file tree.
-   **Default**: `./src`

### semi (-s)

-   Style option indicating whether the barrel files should write semicolons (;) after each line or not.
-   **Default**: `false`

#### Use `barrelly -h` for CLI-specific options
