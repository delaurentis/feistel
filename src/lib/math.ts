/**
 * Compute floor(log_2(x)).
 * @param x input
 */
export function ulog2(x: bigint): bigint {
    let out = 0n
    while ((x >>= 1n)) out += 1n
    return out
}
/**
 * Compute floor(sqrt(s)).
 * @param s input
 */
export function usqrt(s: bigint): bigint {
    let z = 0n
    if (s > 3n) {
        z = s
        let x = s / 2n + 1n
        while (x < z) {
            z = x
            x = (s / x + x) / 2n
        }
    } else if (s != 0n) {
        z = 1n
    }
    return z
}
/**
 * Compute the next perfect square of `n`, unless it's already a perfect square.
 * @param n input
 */
export function nextPerfectSquare(n: bigint): bigint {
    const sqrtN = usqrt(n)
    if (sqrtN ** 2n == n) {
        return n
    }
    return (sqrtN + 1n) ** 2n
}
