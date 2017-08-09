import { DurationCaculator, Customlog } from '../../extend/log-utils'
const durationCaculator = new DurationCaculator()
const requestLog = new Customlog('request server api')

export class RequestLog
{
    /**
     * 请求开始日志打印
     *
     * @static
     * @param {string} uri
     * @param {*} data
     * @param {string} secret
     * @memberof RequestLog
     */
    static onStart(uri: string, data: any, secret: string)
    {
        durationCaculator.setStart()
        requestLog.log(
`
[request data]
[uri         ]: ${uri}
[params      ]: ${JSON.stringify(data)}
[key         ]: ${secret}
`
        )
    }

    /**
     * 请求结束日志打印
     *
     * @static
     * @param {string} uri
     * @param {*} result
     * @memberof RequestLog
     */
    static onEnd(uri: string, result: any)
    {
        durationCaculator.setEnd()
        requestLog.log(
`
[response-data]
[uri          ]: ${uri}
[response     ]: ${JSON.stringify(result).slice(0, 400)}
[response time]: ${durationCaculator.calc()} ms\n
`
        )
    }

    /**
     * 请求错误日志打印
     *
     * @static
     * @param {string} uri
     * @param {*} data
     * @param {Error} err
     * @memberof RequestLog
     */
    static onError(uri: string, data: any, err: Error)
    {
        requestLog.error(
`
[proxy request error]
[uri                ]   : ${uri}
[params             ]:  ${JSON.stringify(data).slice(0, 400)}
[error              ] : ${err}
`
        )
    }
}
