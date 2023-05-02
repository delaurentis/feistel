export function indicesList(len: number) {
    return Array(len)
        .fill(0)
        .map((_, x) => BigInt(x))
}
