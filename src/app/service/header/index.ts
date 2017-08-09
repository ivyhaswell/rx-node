import { isString, isNumber } from 'underscore'
import { time2Second } from '../../extend/time'
import { mime } from '../../extend/mime'
import { Response } from 'express'

/**
 * 设置缓存时间
 *
 * @export
 * @param {(string | number)} options - 时间，可能为字符串，可能为数字
 * @param {Response} res - response
 */
export function cacheControl(options: string | number, res: Response)
{
    let age: string

    if (isString(options)) {
        age = options.indexOf('max-age') === 0
            ? options
            : 'max-age=' + time2Second(options)
    } else if (isNumber(options)) {
        age = 'max-age=' + options.toString()
    }

    if (age) {
        res.set('Cache-Control', age)
    }
}

/**
 * 设置过期时间
 *
 * @param {(string | number)} options - 时间，可能是数字可能是字符串
 * @param {any} res - Response
 */
export function expire(options: string | number, res: Response)
{
    let exp: Date

    if (isString(options)) {
        exp = new Date(Date.now() + (time2Second(options) * 1000))
    } else if (isNumber(options)) {
        exp = new Date(Date.now() + (options * 1000))
    }

    if (exp) {
        res.set('Expires', exp.toUTCString())
    }
}

/**
 * 设置Content-Type
 *
 * @export
 * @param {string} options - 文件类型
 * @param {Response} res - Response
 */
export function contentType(options: string, res: Response)
{
    const type = mime[options]

    if (type) {
        res.set('Content-Type', type)
    }
}

/**
 * 设置Last-Modified
 *
 * @export
 * @param {any} [options=new Date()] - 修改时间
 * @param {Response} res - Response
 */
export function lastModified(options = new Date(), res: Response)
{
    res.set('Last-Modified', options.toUTCString())
}
