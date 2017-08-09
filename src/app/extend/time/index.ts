type timeTag = 'Y' | 'M' | 'D' | 'h' | 'm' | 's'
const tagMap = {
    Y: 365 * 24 * 60 * 60,
    M: 30 * 24 * 60 * 60,
    D: 24 * 60 * 60,
    h: 60 * 60,
    m: 60,
    s: 1,
}

export function time2Second(dateStr: string): number {
    const reg = /(\d{1,4})([YMDhms])/g
    const dateArr = dateStr.match(reg)
    if (!dateArr) { return 0 }

    try {
        let total = 0
        dateArr.forEach((item) => {
            const tag = item.slice(item.length - 1)
            const timeNum: number = parseInt(item.slice(0, -1), 10)

            total += tagMap[tag] * timeNum
        })
        return total
    } catch (error) {
        return 0
    }
}
