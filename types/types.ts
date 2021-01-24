import Block from "../src/core/block"

export type GetChainResponse = {
    nodeIdentifier:string,
    chain:Block[]
    lastBlock: Block
}

export type GetChainLengthResponse = {
    nodeIdentifier:string,
    length:number
}