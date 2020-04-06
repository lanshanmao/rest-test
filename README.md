# rest-test

做为一个切图仔，前段时间也开始加入node大军了。第一次写接口时很懵，对许多概念都不理解，看到许多API的实现方式更加疑惑。之后查阅资料才知道webService有SOA协议和REST两种方式（graphql这里不论)

### SOA
这里简单提一下SOA。SOA是简单对象访问协议，最早是针对RPC的一种解决方案。最大的优点是轻量且可基于多种传输协议传递消息。当SOA普及之后为了应对各种场景，增加了许多东西，轻量的优点不复存在

### REST
REST最早是在Fielding的博士论文中提出的，它本质上并不是什么协议或标准，而是一种更合理利用HTTP协议的方式。

首先使用URI定位资源，通过HTTP协议抽象的请求方式get、post、put、delete在服务器上改变资源状态。对于各种资源的操作最后总能抽象成以上四种操作。且客户端通过Content-Type自定义呈现的数据类型。

其实从上面可以看出REST的核心思想：

##### 面向资源设计接口
所有接口设计都是针对资源来设计，URI定位资源。这里就涉及到分类问题，在中、小型业务中可以使用一些功能前缀例如：`/api` 、`/img`、`/static`等，如果是在大型项目中可以考虑使用子域名

##### 抽象资源操作
对资源的操作都抽象成get,put,post,delete；对于现在复杂的业务结构，只是四种基本操作不一定能满足。一般在公司内部的基建项目中会使用的比较多

##### HTTP是应用协议
soa的一大特点是把HTTP协议当成了传输协议，忽略了HTTP协议中的参数、状态；REST的实现完全依托HTTP协议，可以把REST当成是基于HTTP的自定义应用。它继承了HTTP协议的无状态、自包含的特性

### 一个REST的例子

基于koa的REST例子

##### REST实现
编写一个中间件在每个接口返回时都执行依次reset
`
// middleware
async (ctx, next) => {
    //  重载rest
    ctx.rest = (data) => {
        ctx.response.type = 'application/json'
        ctx.response.body = data
    }
}
`
##### REST分类
接口按照功能前缀去做区分 `/api/`

`
// middleware
const pathPrefix = prefix || '/api/'
async (ctx, next) => {
    if (/^\/api\//.test(pathPrefix)) {
        //  重载rest
        ctx.rest = (data) => {
            ctx.response.type = 'application/json'
            ctx.response.body = data
        }
    }
}
`

##### REST 错误捕获
`
// middleware
const pathPrefix = prefix || '/api/'
async (ctx, next) => {
    if (/^\/api\//.test(pathPrefix)) {
        //  重载rest
        ctx.rest = (data) => {
            ctx.response.type = 'application/json'
            ctx.response.body = data
        }
        try {
            await next()
        } catch(e) {
            ctx.response.status = 400
            ctx.response.type = 'application/json'
            ctx.response.body = {
                code: e.code || 'unknown error',
                msg: e.msg || ''
            }
        }
    }
}
// 错误收集对象
function APIError(code, msg) {
    this.code = code || 'unknown error'
    this.msg = msg || ''
}
`

### 总结
REST请求消息设计：自定义资源URI+自定义参数+基础操作；响应消息设计：将静态资源返回给客户端客户端，HTTP消息作为应用协议而非传输协议


