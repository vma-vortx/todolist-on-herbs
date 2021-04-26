function castRequest(value, type) {
    if (value === undefined) return undefined
    if (Array.isArray(type))
        return [castRequest(value, type[0])]
    if (type === Number) return Number(value)
    if (type === String) return String(value)
}

function req2request(req, useCase) {
    const schema = useCase.requestSchema
    const params = {}
    const fields = Object.keys(schema)
    for (const field of fields) {
        const type = schema[field]
        let value = castRequest(req[field], type)
        if (value !== undefined) params[field] = value
    }
    return params
}

async function defaultController(usecase, req, user, res, next, controller, methodName) {
    try {

        /* Authorization */
        const hasAccess = usecase.authorize(user)
        if (hasAccess === false) {
            // eslint-disable-next-line no-console
            console.info(usecase.auditTrail)
            return res.status(403).json({ message: 'User is not authorized' })
        }

        if (controller.entity && !req.isValid())
            return res.status(400).json({message: 'Invalid request'}) 

        /* Execution */
        const request = req2request(req, usecase)

        if (controller.get && (methodName == 'PUT' || methodName == 'DELETE')) {
            const getResponse = await controller.get.run(request)
            if ( !getResponse.isOk)
                return res.status(404).json({ error: response.err })
        }

        const response = await usecase.run(request)
        
        /* Audit */
        // eslint-disable-next-line no-console
        console.info(usecase.auditTrail)

        /* Response */
        if (response.isOk) res.status(successStatusCodeByMethodName(methodName)).json(response.ok)
        else res.status(400).json({ error: response.err })

        res.end()
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
        res.status(500).json({ error: error.name, message: error.message })
        next()
    }
}

function successStatusCodeByMethodName(methodName) {
    switch (methodName) {
        case 'GET':
            return 201
        case 'POST':
            return 201
        case 'PUT':
            return 200
        case 'DELETE':
            return 200
    }
}

module.exports =  defaultController