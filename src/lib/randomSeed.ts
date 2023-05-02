import { randomBytes } from 'node:crypto'

export function randomSeed() {
    const seed_ = randomBytes(32) // 256b = 64b*4
    let seed = 0n
    for (let i = 0n; i < 4n; i++) {
        seed |= seed_.readBigUint64LE() << (i * 64n)
    }
    return seed
}
