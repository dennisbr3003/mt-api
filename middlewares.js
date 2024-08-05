const compression = require('compression')
const helmet = require('helmet')
const Log = require('./classes/Log')

const log = new Log(__dirname)
log.init()

module.exports = [
    compression(),
    helmet(),
    (req, res, next) => {
        log.write('', '', req)
        next()  
    },    
]