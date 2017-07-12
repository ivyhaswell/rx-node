/*
 * @Author: shuwen.wang
 * @Date: 2017-07-12 11:52:32
 * @Last Modified by: shuwen.wang
 * @Last Modified time: 2017-07-12 12:11:29
 */
import * as lru from 'lru-cache'

export class LruCache
{
    static instance: lru.Cache<{}>
    static getInstance(max?: number, maxAge?: number)
    {
        if (LruCache.instance) {
            return LruCache.instance
        } else {
            return LruCache.instance = lru({ max, maxAge })
        }
    }
}
