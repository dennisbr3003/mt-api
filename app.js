const express = require('express')
const Entity = require('./classes/Entity')

require('dotenv').config()

const initApp = async () => {
    await entity.init() 
}

const app = express()

const entity = new Entity(__dirname)

app.use(require('./middlewares.js'))

app.listen(process.env.PORT) 

// convenient to start the app from the terminal
console.log('ready to receive requests on ', `http://localhost:${process.env.PORT}`)

initApp()

app.get('/player/:deviceId?', async (req, res) => {
    const getPlayer = !!req.params.deviceId ?? false
    if(getPlayer) {
        const player = await entity.getPlayer(req.params.deviceId)
        if(player!==null){
            res.status(200).json(player)
            return
        } 
    }    
    res.status(404).json({type: '404', message: 'resource could not be found' })
})

app.use(async (req, res) => {
    res.status(500).json({type: '500', message: 'unknown or erroneous request' })
})