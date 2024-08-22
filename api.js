const express = require('express')
const Entity = require('./classes/Entity.js')

require('dotenv').config()

const initApp = async () => {
    await entity.init() 
}

const app = express()

const entity = new Entity(__dirname)

// needed to handle axios post body objects
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.post('/message', async (req, res) => {
    const result = await entity.addNewMessage(req.body)
    if(result!==null){
        if(result.updateRegistration){
            const plr = await entity.updatePlayer(req.body) // hier wordt het oude record teruggegeven
        }
        res.status(200).json(result)
        return
    } 
    res.status(404).json({type: '404', message: 'resource could not be found' }) // dit moet een foutmelding in de pagina worden en dan iets als render.back
})

app.get('/message/unread/:deviceId', async (req, res) => {
    const result = await entity.getUnreadMessagesCount(req.params.deviceId)
    res.status(200).json(result)
    return
})

app.use(async (req, res) => {
    res.status(500).json({type: '500', message: 'unknown or erroneous request' })
})