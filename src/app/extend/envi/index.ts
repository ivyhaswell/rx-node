import { Request } from 'express'

const maps = {
    weixin: /MicroMessenger/i,
    weibo: /WeiBo/i,
    qq: /QQ/i,
    qlchat: /qlchat[a-zA-Z]*?\/([\d.]+)/i,
}

function getPlatform(platform: string) {
    return (req: Request) => {
        const ua = req.headers['user-agent'] || ''
        return maps[platform].test(ua)
    }
}

export const isWeixin = getPlatform('weixin')
export const isWeibo = getPlatform('weibo')
export const isQQ = getPlatform('qq')

export function getQlchatVer(req: Request) {
    let ua = req.headers['user-agent'] || ''
    ua = Array.isArray(ua) ? ua[0] : ua
    const qlver = ua.match(/qlchat[a-zA-Z]*?\/([\d.]+)/)

    if (qlver && qlver.length) {
        return parseInt(qlver[1], 10)
    }

    return false
}
