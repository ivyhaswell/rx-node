/**
 * 生成n位随机数
 *
 * @export
 * @param {any} n
 * @returns {string}
 */
export function randomNum(n):string
{
    let ret = ''
    for (let i = 0; i < n; i++) {
        ret += Math.floor(Math.random() * 10)
    }

    return ret
}
