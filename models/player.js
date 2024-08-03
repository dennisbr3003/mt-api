const mongoose = require('mongoose')
const Schema = mongoose.Schema

const playerSchema = new Schema({
    device: {
        type: String,
        required: true
    },
    displayname: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },    
}, { timestamps: true })

// be ware of the naming convention here. Mongoose will pluralise this and use it as the collection name in de database!! (Player -> Players)
const Player = mongoose.model('Player', playerSchema)

module.exports = Player