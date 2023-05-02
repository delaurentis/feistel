import { keccak_256 } from '@noble/hashes/sha3'
import { blake3 } from '@noble/hashes/blake3'
import { sha256 } from '@noble/hashes/sha256'
import { sha1 } from '@noble/hashes/sha1'
import { ripemd160 } from '@noble/hashes/ripemd160'
import { decrypt, encrypt } from './feistel'
import { randomInt } from 'node:crypto'
import { expect } from 'chai'
import { RoundFn } from './lib/RoundFn'
import { bigLEToU8, u8ToBigLE } from './lib/uint'
import { indicesList } from './lib/indicesList'
import { randomSeed } from './lib/randomSeed'

const roundFns: { name: string; f: RoundFn }[] = [
    {
        name: 'keccak256',
        f: (R, i, seed, domain) => {
            const msg = new Uint8Array([
                ...bigLEToU8(R, 256),
                ...bigLEToU8(i, 256),
                ...bigLEToU8(seed, 256),
                ...bigLEToU8(domain, 256),
            ])
            return u8ToBigLE(keccak_256(msg))
        },
    },
    {
        name: 'blake3',
        f: (R, i, seed, domain) => {
            const msg = new Uint8Array([
                ...bigLEToU8(R, 256),
                ...bigLEToU8(i, 256),
                ...bigLEToU8(seed, 256),
                ...bigLEToU8(domain, 256),
            ])
            return u8ToBigLE(blake3(msg))
        },
    },
    {
        name: 'sha256',
        f: (R, i, seed, domain) => {
            const msg = new Uint8Array([
                ...bigLEToU8(R, 256),
                ...bigLEToU8(i, 256),
                ...bigLEToU8(seed, 256),
                ...bigLEToU8(domain, 256),
            ])
            return u8ToBigLE(sha256(msg))
        },
    },
    {
        /** digest is 20B */
        name: 'sha1',
        f: (R, i, seed, domain) => {
            const msg = new Uint8Array([
                ...bigLEToU8(R, 256),
                ...bigLEToU8(i, 256),
                ...bigLEToU8(seed, 256),
                ...bigLEToU8(domain, 256),
            ])
            return u8ToBigLE(sha1(msg))
        },
    },
    {
        /** digest is 20B */
        name: 'ripemd160',
        f: (R, i, seed, domain) => {
            const msg = new Uint8Array([
                ...bigLEToU8(R, 256),
                ...bigLEToU8(i, 256),
                ...bigLEToU8(seed, 256),
                ...bigLEToU8(domain, 256),
            ])
            return u8ToBigLE(ripemd160(msg))
        },
    },
]

describe('Generalised Feistel Cipher', () => {
    describe('Strictly produces permutations under arbitrary domains and round functions', () => {
        for (const { name: hashName, f } of roundFns) {
            describe(hashName, () => {
                const N_TESTS_PER_HASH = 20
                const MIN_DOMAIN = 2
                const MAX_DOMAIN = 5757
                for (let i = 0; i < N_TESTS_PER_HASH; i++) {
                    // For each test, we take a random domain [0,k-1)
                    const X = indicesList(randomInt(MIN_DOMAIN, MAX_DOMAIN))
                    const domain = BigInt(X.length)
                    const seed = randomSeed()
                    const rounds = BigInt(randomInt(2, 6) * 2)
                    const roundFn = f
                    it(`[${i}]\tdomain=${domain}\tseed=0x${seed
                        .toString(16)
                        .padStart(32 * 2, '0')}\trounds=${rounds}`, async () => {
                        const set = new Set<bigint>()
                        for (let x = 0; x < X.length; x++) {
                            const xPrime = encrypt(X[x], domain, seed, rounds, roundFn)
                            set.add(xPrime)
                            // The decrypt function must map x' back to x, otherwise it is not a valid
                            // inverse of the encrypt function.
                            expect(decrypt(xPrime, domain, seed, rounds, roundFn)).to.eq(X[x])
                        }
                        // If the size of the result set is not equal to the size of the input domain,
                        // then we have not produced a permutation.
                        expect(set.size).to.eq(X.length)
                    }).timeout(0)
                }
            })
        }
    })
})
