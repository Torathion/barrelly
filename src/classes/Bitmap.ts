export default class Bitmap {
    #map: number

    constructor(initialState = 0) {
        this.#map = 0
        this.set(initialState)
    }

    /**
     *  Clears the entire cached state
     */
    clear(): void {
        this.#map = 0
    }

    /**
     *  Checks if a specific flag (bit) is set.
     *
     *  @param bit - the flag to check
     *  @returns if the flag is set
     */
    isSet(bit: number): boolean {
        return (this.#map & (1 << bit)) !== 0
    }

    /**
     *  Sets a specific flag
     *
     *  @param bit - the flag to set
     */
    set(bit: number): void {
        this.#map |= 1 << bit
    }

    /**
     *   Returns the current state of the map.
     */
    get state(): number {
        return this.#map
    }

    /**
     *  Toggles a specific flag
     *
     *  @param bit - the flag to toggle
     */
    toggle(bit: number): void {
        this.#map ^= 1 << bit
    }

    /**
     *  Unset a specific flag
     *
     *  @param bit - the flag to unset
     */
    unset(bit: number): void {
        this.#map &= ~(1 << bit)
    }
}
