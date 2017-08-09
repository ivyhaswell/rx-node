import * as express from 'express'
import * as path from 'path'
import { Request, Response, NextFunction } from 'express'
import htmlProcssor, { IHtmlProcessOption } from './app/service/html-processor'
import resProcessor from './app/service/res-processor'
import conf from './config'
import { Proxy } from './app/service/proxy'

const app = module.exports = express()

app.get('/api/:count', count)
app.get('/', test)

let times = 0

async function test(req: Request, res: Response, next: NextFunction)
{
    try {
        const [res1, res2] = await Proxy.apiParallel([
            {
                uri: conf.apiPrefix + '/h5/user/get',
                data: { userId: '100003767000001' },
                secret: conf.secretMap,
            },
            {
                uri: conf.apiPrefix + '/h5/user/power',
                data: { userId: '100003767000001', liveId: '100007735000004' },
                secret: conf.secretMap,
            },
        ])
        console.log('res1', res1)
        console.log('res2', res2)
    } catch (error) {
        console.error(error)
    }

    const option: IHtmlProcessOption = {
        filePath: path.resolve(__dirname, '../build/index.html'),
        fillVars: {
            COUNT: times,
        },
    }
    times++
    htmlProcssor(req, res, next, option)
}

function count(req: Request, res: Response, next: NextFunction)
{
    const cnt = parseInt(req.params.count)
    if (cnt > Math.pow(2, 10)) {
        resProcessor.jsonp(req, res, {
            state: {
                code: 0,
                msg: 'too large number',
            },
        })
        return
    }
    if (cnt < 5) {
        resProcessor.forbidden(req, res, 'too small number')
        return
    }
    resProcessor.jsonp(req, res, {
        state: {
            code: 0,
            msg: 'fit number',
        },
        data: {
            count: times,
        }
    })
}

app.listen(3000)

