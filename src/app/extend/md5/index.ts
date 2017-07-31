import { createHash } from 'crypto'

/**
 * 生成md5
 *
 * @param {(string | Buffer)} data - 数据
 * @param {string} [algo='md5'] - 算法，默认使用md5
 * @returns {string} - md5值
 */
function md5(data: string | Buffer, algo: string = 'md5'): string
{
    const md5 = createHash(algo)
    md5.update(data)
    return md5.digest('hex')
}

export default md5
