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
