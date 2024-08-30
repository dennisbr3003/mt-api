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
            if(mongoose.connection.readyState===0) {
                await mongoose.connect(this.dbURI)
                this.log.write('', 'Entity: Connected to remote MongoDB')
            } 
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
            const result = await message.save() // message is returned   
            if(msg.updateRegistration) await this.updatePlayer(msg)         

            if(msg.resultCode === 1) {
                this.log.write('', `Entity, addNewMessage: message not saved, exited with errorcode 1`)
                return {type: 500, message: `Entity, addNewMessage: message not saved, exited with errorcode 1`}
            } else {
                return {type: 200, message: 'Message saved' }
            }
        } catch(err) {
            this.log.write('', `Entity, addNewMessage: message not saved (${err.message})`)
            return {type: 500, message: `Entity, addNewMessage: message not saved (${err.message})`}
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

    async getUnreadMessagesCount(deviceId) {
        // if the parentUUID is present and filled it's a reply to another message.
        // deviceId is the mailbox or mail conversiotion
        // senderId is the player or the one that responds. isRead is always false if deviceId and senderId are equal.
        // parentUUID is used to connect one message to another (question - reply or replies) is is filled with the UUID of the messages it is a reply to
        // message send by a player typically do not have a parentUUID, and deviceId and senderId are equal
        // Below we count messages that belong to the deviceId conversation but have a different senderId and are not read
        const messageCount = await Message.countDocuments({deviceId: deviceId, senderId: {$ne: deviceId}, isRead: false})
        return {unreadMessages: messageCount}
    }

}

module.exports = Entity