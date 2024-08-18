# CHANGELOG

[Version] European date format

## [1.2.0] 19.08.2024

### Added

-   Warning for exporting from duplicate named resources
-   `ignore` option to ignore paths from the output

### Changed

-   Lexical compare now sorts WITH case sensitivity

### Fixed

-   Removed all file handle warnings
-   Properly remove empty folders from tree

### Misc

-   Cleanup
-   Updated Dependencies

## [1.1.0] 06.08.2024

### Added

-   Shows the exports of each folder inside the table. Folder exports are do not count!
-   Shows the total export count at the end of the table.

### Changed

-   Sort paths lexicographically instead by length
-   Mark root indicator as yellow to visualize the effects of exportEverything
-   Adjust style of table
-   Remove option `countExports` as it should always be the default option

### Fixed

-   Properly sort by file size
-   Separate default and normal exports when exporting a while with multiple exports to fix export-import confusions
-   Remove empty folders that were wrongly categorized as leaves.
-   Add empty line at the end of each barrel file to make formatters and linter happy.

### Misc

-   Updated README.md
-   Turn minification on
