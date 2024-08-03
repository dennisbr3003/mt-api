const mongoose = require('mongoose')
const Log = require('../classes/Log')
const Player = require('../models/player')

require('dotenv').config()

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
        const query = Player.where({ device: deviceId }).select("_id device displayname created")
        return await query.findOne()
    }

}

module.exports = Entity