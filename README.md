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

Using barrelly on this project (1.2.0):

```powershell
barrelly ./src
```

Will print:

```powershell
┌─────────┬───────────────┬─────────┬──────┐
│  action │ folder        │ exports │ size │
├─────────┼───────────────┼─────────┼──────┤
│ updated │ tasks         │       6 │ 352b │
│ updated │ utils/fs      │       6 │ 350b │
│ updated │ utils         │       4 │ 332b │
│ updated │ classes       │       9 │ 315b │
│ updated │ utils/git     │       4 │ 246b │
│ updated │ utils/guards  │       4 │ 234b │
│ updated │ utils/string  │       3 │ 177b │
│ updated │ utils/path    │       2 │ 110b │
│ updated │ structures    │       2 │  64b │
│ updated │ types         │      25 │  53b │
│ updated │ utils/process │       1 │  47b │
└─────────┴───────────────┴─────────┴──────┘

Finished creating barrel files for 66 exports after 26ms!
```

Barrelly can map any kind of files as long as they follow the ESM `import`-`export` syntax. (.ts, .js, .jsx, .tsx, ...)

#### For JS

```powershell
barrelly ./src -g .js
```

#### For TSX

```powershell
barrelly ./src -g .tsx -a .tsx
```

## What are barrel files?

Barrel files are a controversial topic when it comes to JavaScript development. They are basically files that export all the files in their folder as a bundle. They are always created as `index.ts` or `index.js` files because bundlers optimize away this path.

Barrel files have the advantage that:

-   You can ensure that everything you want to export is actually exported. This is particularly important for libraries and toolkits.
-   the number of lines of code can be reduced by bundling different imports from the same folder.

Reducing code:

```ts
import A from './letters/A'
import B from './letters/B'
import C from './letters/C'
```

to:

```ts
import { A, B, C } from './letters'
// import from the index file of the "letters" folder, but because of bundlers, the file part of the path is omitted.
```

Nevertheless, barrel files have a big problem, namely that you can import too much, which causes circular dependencies, which can cause test suites to crash, reduce performance and have other side effects. This is because this bundled export imports everything from the barrel file, but destructures the imports that you actually use. This destructuring process causes everything to be loaded at once, but most of it is discarded. If a bundler is used, this is largely irrelevant as everything is bundled into one file anyway.

## Options

### aliases (-a)

-   List of aliases handles by the bundler
-   Those extensions will be omitted inside the barrel file.
-   **Default**: `[]`

### exportEverything (-e)

-   Flag indicating whether everything should be exported from the target folder.
-   Necessary for libraries to ensure everything that should be exported will be exported.
-   Useful for sub folders to reduce the lines of code (LOC) when importing the code.
-   **Default**: `false`

### ignore (-e)

-   Array holding all folders to ignore
-   If root is ignored, it ends prematurely
-   If everything is ignored, it ends prematurely
-   **Default**: `[]`

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
