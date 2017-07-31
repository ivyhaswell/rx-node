import * as express from 'express'
import * as path from 'path'
import { Request, Response, NextFunction } from 'express'
import htmlProcssor, { IHtmlProcessOption } from './app/service/html-processor'
import resProcessor from './app/service/res-processor'

const app = module.exports = express()

app.get('/api/:count', count)
app.get('/', test)

let times = 0

function test(req: Request, res: Response, next: NextFunction) {
    const option: IHtmlProcessOption = {
        filePath: path.resolve(__dirname, '../build/index.html'),
        fillVars: {
            COUNT: times,
        },
    }
    times++
    htmlProcssor(req, res, next, option)
}

function count(req: Request, res: Response, next: NextFunction) {
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

