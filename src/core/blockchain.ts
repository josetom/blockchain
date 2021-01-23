import Block from './block'
import Transaction from './transaction'
import { proofOfWork } from './algorithms'

class Blockchain {

    private chain:Block[]
    private transactions:Transaction[]

    constructor() {
        this.chain = []
        this.clearTransactions()

        // genesis block
        this.newBlock(100, '1')
    }

    /**
     * Adds new block to the blockchain
     * @param proof
     * @param prevHash
     */
    newBlock = (proof:number, prevHash?:string):Block => {
        prevHash = prevHash || this.lastBlock().hash()
        const newBlock:Block = new Block(this.chain.length, this.transactions, prevHash, proof);

        this.chain.push(newBlock)
        this.clearTransactions()

        return newBlock
    }

    /**
     * clears the current set of transactions
     */
    private clearTransactions = () => {
        this.transactions = []
    }

    /**
     * Add transactions to the blockchain
     * @param transaction
     */
    addTransaction = (transaction: Transaction):number => {
        this.transactions.push(transaction)
        return this.lastBlock().getIndex() + 1
    }

    /**
     * Returns the last block in the chain
     */
    lastBlock = ():Block => {
        return this.chain[this.chain.length - 1]
    }

    /**
     * returns the entire chain
     */
    getChain = ():Block[] => {
        return this.chain
    }

    /**
     * Mine
     * @param nodeIdentifier
     */
    mine = (nodeIdentifier:string):Block => {
        const lastBlock:Block = this.lastBlock()
        const lastProof:number = lastBlock.getProof()
        const proof:number = proofOfWork(lastProof)

        // We must receive a reward for finding the proof.
        // The sender is "0" to signify that this node has mined a new coin.
        this.addTransaction({
           sender: '0',
           receipient: nodeIdentifier,
           amount: 1
        })

        return this.newBlock(proof)
    }

}

export default new Blockchain()