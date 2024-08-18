const mongoose = require('mongoose')
const Log = require('../classes/Log')
const Player = require('../models/player')
const App = require('../models/app')
const Message = require('../models/message')
const { decode } = require("url-safe-base64")

const lib = require('../lib/uuid')

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
        // deviceId is base64 encode and url-safe
        const query = Player.where({ deviceId: atob(decode(deviceId)) }).select("_id deviceId displayName email")
        return await query.findOne() // player object is returned
    }

    async addNewMessage(msg) {
        // smart naming in the form makes this object reusable without editing (see message.js)
        const message = new Message(msg) 
        // update some fields on save
        message.messageUUID = lib.generateUUID()    
 
        try{
            // console.log(res) // to trigger an error
            return await message.save() // message is returned            
        } catch(err) {
            msg.resultCode = 1
            //return {save: false, message: `Entity: message not saved: ${err.message}`}
            return msg
        }
    }

    async getApp(appId) {
        const query = App.where({ app: appId })
        return await query.findOne() // app object is returned
    }    

    async updatePlayer(msg) {
        const filter = { deviceId: msg.deviceId } // find by device id
        const update = { displayName: msg.name, email: msg.email, language: msg.language} // update the fields
        const player = await Player.findOneAndUpdate(filter, update)
        return player
    }

}

module.exports = Entity