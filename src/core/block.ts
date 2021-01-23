import Transaction from "./transaction"
import { hashSha256 } from './algorithms'

export default class Block {
    private index:number;
    private timestamp:Date;
    private transactions:Transaction[];
    private previousHash:string
    private proof:number;

    constructor(index:number, transactions:Transaction[], previousHash:string, proof:number) {
        this.index = index
        this.timestamp = new Date()
        this.transactions = transactions
        this.previousHash = previousHash
        this.proof = proof
    }

    hash = ():string => {
        return hashSha256(this)
    }

    getTransactions = ():Transaction[] => {
        return this.transactions
    }

    getProof = ():number => {
        return this.proof
    }

    getIndex = ():number => {
        return this.index
    }

}