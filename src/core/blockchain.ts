import axios, { AxiosResponse } from 'axios'
import { Logger } from 'tslog'

import Block from './block'
import Transaction from './transaction'
import { proofOfWork } from './algorithms'
import { GetChainResponse, GetChainLengthResponse } from '../../types/types'
import { validateChain } from './utils'

const LOGGER:Logger = new Logger()

class Blockchain {

    private chain:Block[]
    private transactions:Transaction[]
    private nodes:Set<string>

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

    /**
     * Adds a new node
     * @param address
     */
    registerNode = (address:string) => {
        this.nodes.add(address)
    }

    /**
     * This is our Consensus Algorithm, it resolves conflicts by replacing our chain with the longest one in the network.
     */
    resolveConflicts = () => {
        const neighbours:Set<string> = this.nodes
        let maxLength = this.chain.length
        let newChain:Block[]

        // Verify the chains from all the nodes in our network
        neighbours.forEach(async node => {
            try {
                const getChainLengthResponse:AxiosResponse<GetChainLengthResponse> = await axios.get(`http://${node}/chain/length`)
                if(getChainLengthResponse.data.length > maxLength) {
                    const getChainResponse:AxiosResponse<GetChainResponse> = await axios.get(`http://${node}/chain`)
                    if(validateChain(getChainResponse.data.chain)) {
                        maxLength = getChainLengthResponse.data.length
                        newChain = getChainResponse.data.chain
                    }
                }
            } catch (e) {
                LOGGER.error(e)
            }
        })

        if(newChain != null) {
            // Replace our chain if we discovered a new, valid chain longer than ours
            this.chain = newChain
            return true
        }

        return false
    }

    getNodes = ():Set<string> => {
        return this.nodes
    }

}

export default new Blockchain()