import * as rp from 'request-promise'
import conf from '../../../config'
import md5 from '../../extend/md5'
import { randomNum } from '../../extend/number-utils'
import { RequestLog } from './request-log'
import { parallel, series } from 'async'

interface IRequest {
    id: string
    sign: string
    timestamp: number
    data: any
}

interface IApiParams {
    uri: string
    data?: any
    secret: string
}

export class Proxy {
    private static wrapReqParams(data: any, secret: string): IRequest {
        const timestamp = (new Date()).getTime()
        const id = timestamp + randomNum(3)
        const sign = md5(id + ':' + secret + ':' + timestamp)

        return { timestamp, id, sign, data }
    }

    /**
     * 单个api请求
     *
     * @static
     * @param {IApiParams} params
     * @returns
     * @memberof Proxy
     */
    public static api(params: IApiParams) {
        RequestLog.onStart(params.uri, params.data, params.secret)

        return new Promise(function (resolve, reject) {
            rp.post(params.uri, {
                body: Proxy.wrapReqParams(params.data, params.secret),
                json: true,
                timeout: conf.requestTimeout,
            }).then(result => {
                RequestLog.onEnd(params.uri, result)
                resolve(result)
            }).catch(err => {
                RequestLog.onError(params.uri, params.data, err)
                reject(err)
            })
        })
    }

    /**
     * 并发请求
     *
     * @static
     * @param {IApiParams[]} tasks
     * @returns
     * @memberof Proxy
     */
    public static apiParallel(tasks: IApiParams[]) {
        const parallels = tasks.map(item =>
            async (callback) => { callback(null, await Proxy.api(item)) }
        )

        return new Promise((resolve, reject) => {
            parallel(parallels, (err, results) => {
                if (err) {
                    console.error(err)
                    reject(err)
                }
                resolve(results)
            })
        })
    }

    /**
     * 连续请求
     *
     * @static
     * @param {IApiParams[]} tasks
     * @returns
     * @memberof Proxy
     */
    public static apiSeries(tasks: IApiParams[]) {
        const parallels = tasks.map(item =>
            async (callback) => { callback(null, await Proxy.api(item)) }
        )

        return new Promise((resolve, reject) => {
            series(parallels, (err, results) => {
                if (err) {
                    console.error(err)
                    reject(err)
                }
                resolve(results)
            })
        })
    }
}
