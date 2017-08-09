import { Request, Response, NextFunction } from 'express'
import { get as loget } from 'lodash'

class ResProcessor {

    static jsonp(req: Request, res: Response, data: Object = {}) {
        const callback = loget(req, 'query.callback')
        let dataStr = JSON
            .stringify(data)
            .replace(/(\u0085)|(\u2028)|(\u2029)/g, '')

        if (callback) {
            res.set('Content-Type', 'application/javascript')
            res.send(callback + '(' + dataStr + ')')
        } else {
            res.send(dataStr)
        }
    }

    static ok(req: Request, res: Response, msg: string = 'ok') {
        res.status(200).send(msg)
    }

    static forbidden(req: Request, res: Response, msg = '无访问权限') {
        res.status(403)

        if (typeof msg === 'object') {
            ResProcessor.jsonp(req, res, msg)
            return
        }

        res.send(msg)
    }

    static error500(req: Request, res: Response, msg = '这是一个错误页面') {
        res.render('500', {
            msg,
        })
    }

    static reject(req: Request, res: Response, { isLive, liveId }) {
        res.render('reject', {
            isLive,
            liveId,
        })
    }

    static paramMiss(req: Request, res: Response, msg: string) {
        console.error(`[param miss error] req path: ${req.path},  query: ${req.query}, body: ${req.body}`)

        if (/^\/api/.test(req.originalUrl)) {
            const re = {
                success: false,
                state: {
                    code: 1,
                    msg: msg || '缺少必要参数',
                }
            }
            ResProcessor.jsonp(req, res, re)
        } else {
            res.status(404).send(msg || '页面不存在')
        }
    }
}

export default ResProcessor
