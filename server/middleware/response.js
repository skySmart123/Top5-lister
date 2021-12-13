function response_middleware(req, res, next) {

    /**
     * (default status 200)
     * Success response
     */
    res.success = function ({message = "", data = {}}) {
        return res
            .status(200)
            .json({
                success: true,
                message,
                data,
            })
    }

    /**
     * Custom error response
     */
    res.error = function ({code = 200, message = "", data = {}}) {
        return res
            .status(code)
            .json({
                success: false,
                message,
                data,
            })
    }

    /**
     * (status 400)
     * Bad request response
     */
    res.badRequest = function ({message = "Bad request", data = {}}) {
        return res
            .error({
                code: 400,
                message,
                data,
            })
    }

    /**
     * (status 403)
     * Forbidden request response
     */
    res.forbidden = function ({message = "Forbidden", data = {}}) {
        return res.error({
            code: 403,
            message,
            data,
        })
    }

    /**
     * (status 401)
     * Unauthorized request response
     */
    res.unauthorized = function ({message = "Unauthorized", data = {}}) {
        return res.error({
            code: 401,
            message,
            data,
        })
    }

    /**
     * (status 500)
     * Internal request response
     */
    res.internal = function ({message = "Internal server error", data = {}}) {
        return res.error({
            code: 500,
            message,
            data,
        })
    }

    next()
}

module.exports = response_middleware;