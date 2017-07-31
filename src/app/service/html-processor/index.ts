/*
 * @Author: shuwen.wang
 * @Date: 2017-07-12 10:39:33
 * @Last Modified by: shuwen.wang
 * @Last Modified time: 2017-07-31 16:07:38
 */
import * as fs from 'fs'
import { each, isFunction } from 'underscore'

import { cacheControl, expire, contentType, lastModified } from '../header'
import md5 from '../../extend/md5'
import { LruCache } from '../../extend/cache'
const cache = LruCache.getInstance()

import Renderer from './renderer'
const renderer = new Renderer()
import readHTML from './read-html'

export interface IHtmlProcessOption {
    filePath: string
    headers?: Object
    fillVars?: Object
    renderData?: Object
    [index: string]: any
}

function HTMLProcessor(req, res, next, opts: IHtmlProcessOption) {
    const { filePath, headers } = opts
    let html = readHTML(filePath)

    if (!html) {
        next()
        return
    }

    html = renderer.render(html, opts)
    contentType('html', res)

    each(headers as any, (val, key) => {
        if (isFunction(val)) {
            val = val.call(null)
        }
        res.set(key, val)
    })

    res.status(200).send(html)
}

export default HTMLProcessor
