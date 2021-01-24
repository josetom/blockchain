import { hashSha256, validateProof } from './algorithms'
import Block from './block'

/**
 * Validate the chain
 */
export const validateChain = (chain:Block[]) => {
    let lastBlock:Block = chain[0]
    let index:number = 1

    while(index < chain.length) {
        const block:Block = chain[index]

        // Check that the hash of the block is correct
        if(block.getPreviousHash() !== hashSha256(lastBlock)) {
            return false
        }

        // Check that the Proof of Work is correct
        if(validateProof(lastBlock.getProof(), block.getProof())) {
            return false
        }

        lastBlock = block
        index += 1
    }

    return true
}