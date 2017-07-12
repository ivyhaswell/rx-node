/*
 * @Author: shuwen.wang 
 * @Date: 2017-07-12 00:02:40 
 * @Last Modified by: shuwen.wang
 * @Last Modified time: 2017-07-12 00:10:04
 */
type timeTag = 'Y' | 'M' | 'D' | 'h' | 'm' | 's'

const tagMap = {
    'Y': 365 * 24 * 60 * 60,
    'M': 30 * 24 * 60 * 60,
    'D': 24 * 60 * 60,
    'h': 60 * 60,
    'm': 60,
    's': 1,
}

export function date2Second(dateStr: string): number {
    const reg = /(\d{1,4})([YMDhms])/g
    const dateArr = dateStr.match(reg)
    if (!dateArr) { return 0 }

    try {
        let total = 0
        dateArr.forEach((item) => {
            const timeTag = item.slice(item.length - 1)
            const timeNum: number = parseInt(item.slice(0, -1))

            total += tagMap[timeTag] * timeNum
        })
        return total
    } catch (error) {
        console.error(error)
        return 0
    }
}