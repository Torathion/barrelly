import type { ElectronProcess } from 'src/types'
import isElectronApp from './isElectronApp'

export default function isBundledElectronApp(): boolean {
    /*
     * process.defaultApp is only set when the environment is electron and it's run in production mode
     * see https://github.com/electron/electron/blob/main/docs/api/process.md#processdefaultapp-readonly
     */
    return isElectronApp() && !(process as ElectronProcess).defaultApp
}
