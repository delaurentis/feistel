import { plot } from 'nodeplotlib'
import { PlotData } from 'plotly.js'
import { indicesList } from '../lib/indicesList'
import { randomInt } from 'crypto'
import { randomSeed } from '../lib/randomSeed'
import { RoundFn } from '../lib/RoundFn'
import { bigLEToU8, u8ToBigLE } from '../lib/uint'
import { keccak_256 } from '@noble/hashes/sha3'
import { encrypt } from '../feistel'

const N_TESTS = 10
const DOMAIN_SIZE = 10_000
const ROUNDS = 4n
const roundFn: RoundFn = (R, i, seed, domain) => {
    const msg = new Uint8Array([
        ...bigLEToU8(R, 256),
        ...bigLEToU8(i, 256),
        ...bigLEToU8(seed, 256),
        ...bigLEToU8(domain, 256),
    ])
    return u8ToBigLE(keccak_256(msg))
}

const runs: Partial<PlotData>[] = []
const X = indicesList(DOMAIN_SIZE)
for (let i = 0; i < N_TESTS; i++) {
    // For each test, we take a random domain [0,k-1)
    const seed = randomSeed()
    console.log(`seed=${seed.toString(16).padStart(64, '0')}`)
    const xPrimes = new Array<bigint>(X.length)
    for (let x = 0; x < X.length; x++) {
        xPrimes[x] = encrypt(X[x], BigInt(X.length), seed, ROUNDS, roundFn)
    }
    runs[i] = {
        type: 'scatter',
        mode: 'markers',
        name: `0x${seed.toString(16).padStart(64, '0')}`,
        'marker.size': 0.1,
        'marker.color': `#${seed.toString(16).slice(-6)}`,
        x: X.map((v) => Number(v)),
        y: xPrimes.map((v) => Number(v)),
    }
}

plot(runs, {
    width: 2000,
    height: 2000,
})
