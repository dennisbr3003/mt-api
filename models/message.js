const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
    name: {
        type: String,
        required: true        
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },   
    isRead: {
        type: Boolean,
        required: true,
        default: false
    },        
    deviceId: {
        type: String,
        required: true
    },
    messageUUID: {
        type: String,
        required: true
    },
    parentUUID: {
        type: String,
        required: false,
    },
    resultCode: {
        type: Number,
        required: false,
        default: 0
    },
    updateRegistration: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }) // creates fields "createdAt" and "updatedAt"

// be ware of the naming convention here. Mongoose will pluralise this and use it as the collection name in de database!! (Message -> Messages)
const Message = mongoose.model('Message', messageSchema)

module.exports = Message