import * as fs from 'fs'
import md5 from '../../extend/md5'
import { LruCache } from '../../extend/cache'
const cache = LruCache.getInstance()

function readHTML(filePath: string) {
    const cacheKey = md5(filePath)
    let html
    try {
        html = cache.get(cacheKey)
        /* 拿不到缓存则读取文件 */
        if (!html) {
            console.log('not use html cache. cacheKey:', cacheKey, ' path:', filePath)
            html = fs.readFileSync(filePath, 'utf8')
            cache.set(cacheKey, html)
        }
        return html
    } catch (error) {
        console.error('HTML Process Error', error)
        return false
    }
}

export default readHTML
