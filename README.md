# Feistel Shuffle (GFC-FPE)

A generalised Feistel cipher that implements format-preserving encryption, bijectively mapping $X \rightarrow X$ with pseudorandom permutation $\pi^{S}$ determined by a random seed $S$. This algorithm was originally proposed by Black & Rogaway [1].

## Iteration Bounds

For this implementation of the generalised Feistel cipher, the selection of parameters $a$ and $b$ for a cipher on domain $k$ are automatically chosen as $a = b = h = \lceil \sqrt{k} \rceil$ (the _next perfect square_). This gives (from [1]):

$$
\delta_{k} = 2 \cdot \sqrt{k} + 1
$$

where $\delta_{k}$ denotes the number of elements that lie outside of the domain $k$ for which we need to perform an additional cycle-walk iteration.

It follows that the upper bound of cycle-walking iterations $C$ (from [2]) is denoted by:

$$
C = \lceil \frac{n}{h} \rceil
$$

## Pseudorandom Round Functions

With an input domain $D$, the round function $f_i$ should output unique keys $K_0, ..., K_{r-1}$, where $D \subset K$, that will be used as the round keys for $r$ rounds of Feistel.

## Feistel Rounds

For sufficient entropy (and generating numbers that feel random from consecutive integers), I recommend using 32 rounds of fiestel.

## Randomness of Permutations

The following figure shows the permuted indices (y-axis) for each input (x-axis) in a domain of size $10000$ with $r = 4$ Feistel rounds, using keccak256 and some 256-bit random seed as the pseudorandom function.

![gfc_single](https://user-images.githubusercontent.com/10385659/235701085-ec598e00-9822-4101-b434-3426613e2037.png)

The following figure plots 10 instances of GFC-FPE outputs with the same configuration as above, but using a different 256-bit random seed for each instance.

![gfc_10_runs](https://user-images.githubusercontent.com/10385659/235701120-0877141b-df82-428d-97c7-9803612d280c.png)

## Literature

[[1]](https://eprint.iacr.org/2001/012.pdf) John Black and Phillip Rogaway. 2002. Ciphers with arbitrary finite domains. In _Topics in Cryptology—CT-RSA 2002: The Cryptographers’ Track at the RSA Conference 2002 San Jose, CA, USA, February 18–22, 2002 Proceedings_, Springer, 114–130.

[[2]](https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=44a92f047caf3e1b8f83375a9fcfb10aaa5380eb) Bruce Schneier and John Kelsey. 2005. Unbalanced Feistel networks and block cipher design. In _Fast Software Encryption: Third International Workshop Cambridge, UK, February 21–23 1996 Proceedings_, Springer, 121–144.

[[3]](https://www.researchgate.net/profile/Michael-Luby-2/publication/220618451_How_to_Construct_Pseudorandom_Permutations_from_Pseudorandom_Functions/links/5fe0073aa6fdccdcb8ebce5d/How-to-Construct-Pseudorandom-Permutations-from-Pseudorandom-Functions.pdf) Michael Luby and Charles Rackoff. 1988. How to construct pseudorandom permutations from pseudorandom functions. _SIAM Journal on Computing_ 17, 2 (1988), 373–386.

[[4]](https://www.iacr.org/archive/crypto2010/62230607/62230607.pdf) Viet Tung Hoang and Phillip Rogaway. 2010. On Generalized Feistel Networks. In _CRYPTO_, Springer, 613–630.

[[5]](https://github.com/ethereum/research/blob/master/shuffling/feistel_shuffle.py) Vitalik Buterin. 2018. `feistel_shuffle.py`. In _ethereum/research_.
