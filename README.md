# rest-test

做为一个切图仔，前段时间也开始加入node大军了。第一次写接口时很懵，对许多概念都不理解，看到许多API的实现方式更加疑惑。之后查阅资料才知道webService有SOA协议和REST两种方式（graphql这里不论）


##### 开发REST API

REST API 编写需要注意以下几个问题：

一、URI 如何设置

其实 REST 并不规定 URI 格式，但在项目中使用时需要需要区分不同的 API。比如可以使用功能前缀命名：`/static/`、`/api/`；如果是大项目可以使用子域名进行区分
`// 前缀以/api去做区分
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
`

使用时按照
`router.get('/aip/findAllPerson', async (ctx, next) => { await ctx.rest({ ...data.findAllPerson() }) })`

二、Error 收集、返回

业务接口 error 大概可以分为两种类型：`200`和`非200`。200中还会含有许多业务自定义code，例如`1001`表示参数错误，`1002`表示未登录等；
`非200`基本认为是服务端代码的问题或者更上层的错误

`router.post('/aip/createOne', async (ctx, next) => {
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
 `

