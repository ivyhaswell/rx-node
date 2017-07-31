/*
 * @Author: shuwen.wang
 * @Date: 2017-07-11 18:14:23
 * @Last Modified by: shuwen.wang
 * @Last Modified time: 2017-07-31 16:07:32
 */
import * as express from 'express'
import * as path from 'path'
import htmlProcssor, { IHtmlProcessOption } from './app/service/html-processor'

const app = module.exports = express()

app.get('/', count)

let times = 0

function count(req, res, next) {
    const option: IHtmlProcessOption = {
        filePath: path.resolve(__dirname, '../build/index.html'),
        fillVars: {
            COUNT: times,
        },
    }
    times++
    htmlProcssor(req, res, next, option)
}

app.listen(3000)

