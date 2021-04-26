const generateRoutes = require('./generateRoutes')
const controllersList = require('./_controllerlist')

function controllers(app) {
    generateRoutes(controllersList, app)
}

module.exports = controllers