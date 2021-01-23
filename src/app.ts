import express from 'express';
import * as dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import { Logger } from "tslog";
import { v4 } from 'uuid'

// Env Config
dotenv.config();

import Blockchain from './core/blockchain'
import Block from './core/block';

// setup
const PORT = process.env.PORT
const LOGGER: Logger = new Logger()
const NODE_IDENTIFIER:string = v4()

const app = express();
app.use(cors())
app.use(bodyParser.json())

app.get('/mine', (req:express.Request, res:express.Response) => {
    const block:Block = Blockchain.mine(NODE_IDENTIFIER)
    res.json({
        message: "New Block Forged",
        event: 'new_block',
        block
    })
})

app.post('/transactions', (req:express.Request, res:express.Response) => {
    const index:number = Blockchain.addTransaction(req.body)
    res.json({
        index,
        transaction: req.body
    })
})

app.get('/chain', (req:express.Request, res:express.Response) => {
    res.json({
        chain: Blockchain.getChain(),
        lastBlock: Blockchain.lastBlock()
    })
})

app.listen(PORT, () => {
    LOGGER.info(`Dex running on port : ${PORT}`)
})