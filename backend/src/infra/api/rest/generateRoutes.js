const defaultController = require('./defaultController')

function generateRoutes(controllersList, app) {
    controllersList.forEach(controller => {
        if (controller.get) {
            app.get(`/${controller.name}`, async (req, res, next) => {
                const request = req.query
                const usecase = controller.get
                await defaultController(usecase, request, req.user, res, next, controller, 'GET')
            })

            app.get(`/${controller.name}/:id`, async (req, res, next) => {
                const request = Object.assign({}, req.query, req.params)
                const usecase = controller.get
                await defaultController(usecase, request, req.user, res, next, controller, 'GET')
            })
        }

        if (controller.post) {
            app.post(`/${controller.name}`, async (req, res, next) => {
                const request = Object.assign(new controller.entity(), req.body)
                const usecase = controller.post
                await defaultController(usecase, request, req.user, res, next, controller, 'POST')
            })
        }

        if (controller.put) {
            app.put(`/${controller.name}/:id`, async (req, res, next) => {
                const request = Object.assign(new controller.entity(), req.body, req.params)
                const usecase = controller.put
                await defaultController(usecase, request, req.user, res, next, controller, 'PUT')
            })
        }

        if (controller.delete) {
            app.delete(`/${controller.name}/:id`, async (req, res, next) => {
                const request = req.params
                const usecase = controller.delete
                await defaultController(usecase, request, req.user, res, next, controller, 'DELETE')
            })
        }
    })
}

module.exports = generateRoutes