const mongoose = require('mongoose')
const Log = require('../classes/Log')
const Player = require('../models/player')
const App = require('../models/app')

const { decode } = require("url-safe-base64")

require('dotenv').config()

/*
    btoa() takes a string and encodes it to Base64.
    atob() takes a string and decodes it from Base64.

    // test
    const { encode, decode } = require("url-safe-base64")
    let test = lib.generateUUID()
    console.log(test)
    let encodedString = encode(btoa(test))
    console.log(encodedString)
    let decodedString = atob(decode(encodedString))
    console.log(decodedString)

    // 56191af4-60a4-4b9b-be51-91056dd32f1e
    // NTYxOTFhZjQtNjBhNC00YjliLWJlNTEtOTEwNTZkZDMyZjFl
    // 56191af4-60a4-4b9b-be51-91056dd32f1e

    // einde test

*/

class Entity {
    
    constructor(root){
        this.dbURI = `mongodb+srv://${process.env.USER}:${process.env.PWD}@math-thingy.hcmbohg.mongodb.net/maththingy?retryWrites=true&w=majority&appName=math-thingy`
        this.root = root
        this.log = new Log(this.root)
        this.log.prepare() // quick init
    }

    async init(){
        await this.#connectToMongo()
    }   

    #connectToMongo = async () => {
        try{    
            await mongoose.connect(this.dbURI);
            this.log.write('', 'Entity: Connected to remote MongoDB')
        } catch(err) {
            this.log.write('', `Entity: Not connected to remote MongoDB ${err.message}`)
        }
    }

    async getPlayer(deviceId) {
        // deviceId is base64 encode and url-safe
        const query = Player.where({ device: atob(decode(deviceId)) }).select("_id device displayname created")
        return await query.findOne()
    }

    async getApp(appId) {
        // deviceId is base64 encode and url-safe
        const query = App.where({ app: appId })
        return await query.findOne()
    }    

}

module.exports = Entity