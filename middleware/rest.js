module.exports = {
    APIError: (code, msg) => {
        this.code = code || 'unknown error'
        this.msg = msg || ''
    },
    normalizeRest: (prefix) => {
        const pathPrefix = prefix || '/api/'
        return async (ctx, next) => {
            // whether it starts with '/api/'
            if (/^\/api\//.test(pathPrefix)) {
                // bind rest normalize handle
                if (!ctx.rest){
                    ctx.rest = (data) => {
                        ctx.response.type = 'application/json'
                        ctx.response.body = data
                    }
                    // error handling
                    try {
                        await next()
                    } catch (e) {
                        // error code
                        ctx.response.status = 400
                        ctx.response.type = 'application/json'
                        ctx.response.body = {
                            code: e.code || 'unknown error',
                            msg: e.msg || ''
                        }
                    }
                }
            } else {
                await next()
            }
        }
    }
}
