import crypto from 'crypto'

/**
 * Generates hash
 * @param payload
 */
export const hashSha256 = (payload:any) => {
    return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

/**
 * Simple Proof of Work Algorithm:
 * - Find a number p' such that hash(pp') contains leading 4 zeroes, where p is the previous p'
 * - p is the previous proof, and p' is the new proof
 * @param lastProof
 */
export const proofOfWork = (lastProof:number):number => {
    let proof = 0
    while(validateProof(lastProof, proof) === false) {
        proof += 1
    }
    return proof
}

/**
 * Validates the Proof: Does hash(`${lastProof}${proof}`) contain 4 leading zeroes?
 * @param lastProof
 * @param proof
 */
export const validateProof = (lastProof:number, proof:number):boolean => {
    const guess = `${lastProof}${proof}`;
    const guessHash = hashSha256(guess)
    return guessHash.endsWith('0000')
}