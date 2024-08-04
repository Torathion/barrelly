import type { ElectronProcess } from 'src/types'

export default function isElectronApp(): boolean {
    /*
     * process.versions.electron is a electron specific process attribute
     * see https://github.com/electron/electron/blob/main/docs/api/process.md#processversionselectron-readonly
     */
    return !!(process as ElectronProcess).versions.electron
}
