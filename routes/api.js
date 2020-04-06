const data = require('../database/data')
const APIError = require('../middleware/rest').APIError
const router = require('koa-router')()

router.get('/aip/findAllPerson', async (ctx, next) => {
    await ctx.rest({
        ...data.findAllPerson()
    })
})
router.get('/aip/findOne', async (ctx, next) => {
    await ctx.rest({
        ...data.findOne(ctx.query.id)
    })
})

router.post('/aip/createOne', async (ctx, next) => {
    const {name, age, sex} = ctx.request.body
    const person = await data.createOne(name, age, sex)
    if (person) {
        await ctx.rest({
            ...person
        })
    } else {
        throw new APIError('EC1002', '未登录')
    }
})

router.post('/aip/deletePerson', async (ctx, next) => {
    const {id} = ctx.request.body
    const delPserson = await data.deletePerson(id)
    if (delPserson) {
        await ctx.rest({
            ...delPserson
        })
    } else {
        throw new APIError('EC1001', '参数错误')
    }
})

module.exports = router
