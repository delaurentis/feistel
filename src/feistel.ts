import assert from './lib/assert'
import { RoundFn } from './lib/RoundFn'
import { usqrt, nextPerfectSquare } from './lib/math'

/**
 * Map x to its permuted value x' in `domain`. The permutation is deterministic
 * on `seed`.
 * @param x Original value to permute
 * @param domain Domain of x that this function bijectively maps over
 * @param seed Secure pseudorandom number to be used as the seed
 * @param rounds Number of Feistel rounds to apply; consider setting to >=4
 *  We cheat here by rejecting odd rounds
 * @param f Feistel round function that produces a hash
 * @returns permuted value x'
 */
export function encrypt(
    x: bigint,
    domain: bigint,
    seed: bigint,
    rounds: bigint,
    f: RoundFn
): bigint {
    assert(domain !== 0n, 'modulus must be > 0')
    assert(x < domain, 'x too large')
    assert((rounds & 1n) === 0n, 'rounds must be even')

    const h = usqrt(nextPerfectSquare(domain))
    do {
        let L = x % h
        let R = x / h
        for (let i = 0n; i < rounds; i++) {
            const nextR = (L + f(R, i, seed, domain)) % h
            L = R
            R = nextR
        }
        x = h * R + L
    } while (x >= domain)
    return x
}

/**
 * Inverse-map x' to its original value x in `domain`. Use the same `seed` that
 * was used to originally permute x.
 * @param xPrime Permuted value value x'
 * @param domain Domain of x that this function bijectively maps over
 * @param seed Secure pseudorandom number to be used as the seed
 * @param rounds Number of Feistel rounds to apply; consider setting to >=4
 *  We cheat here by rejecting odd rounds
 * @param f Feistel round function that produces a hash
 * @returns original value x
 */
export function decrypt(
    xPrime: bigint,
    domain: bigint,
    seed: bigint,
    rounds: bigint,
    f: RoundFn
): bigint {
    assert(domain !== 0n, 'modulus must be > 0')
    assert(xPrime < domain, 'x too large')
    assert((rounds & 1n) === 0n, 'rounds must be even')

    const h = usqrt(nextPerfectSquare(domain))
    do {
        let L = xPrime % h
        let R = xPrime / h
        for (let i = 0n; i < rounds; i++) {
            const nextL = (R + h - (f(L, rounds - i - 1n, seed, domain) % h)) % h
            R = L
            L = nextL
        }
        xPrime = h * R + L
    } while (xPrime >= domain)
    return xPrime
}
