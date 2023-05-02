export function bigLEToU8(x: bigint, bits: number): Uint8Array {
    const byteLength = Math.ceil(bits / 8)
    const out = new Uint8Array(byteLength)
    for (let i = 0; i < byteLength; i++) {
        out[i] = Number((x >> BigInt(i * 8)) & 0xffn)
    }
    return out
}

export function u8ToBigLE(buf: Uint8Array): bigint {
    const hex = Array.from(buf)
        .map((v) => v.toString(16).padStart(2, '0'))
        .join('')
    return BigInt('0x' + hex)
}
