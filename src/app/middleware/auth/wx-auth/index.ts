import conf from '../../../../config'
import resProcessor from '../../../service/res-processor'
import { Proxy } from '../../../service/proxy'

import { fillParams } from '../../../extend/url-utils'
import { getAuthLoginUrl } from '../../../extend/wx-utils'
import { isWeixin } from '../../../extend/envi'

import { extend, pick } from 'underscore'
import { get as loget } from 'lodash'
import { Request, Response, NextFunction } from 'express'

const cookieTimeout = 60 * 60 * 24 * 1000
// 旧项目生成的cookie的sessionId对应的key
const jsessionIdCookieKey = 'QLZB_SESSIONID'
// sessionid 加密因子
const sessionidFeed = 'QiAnLiAo03251450aES'

async function verify(username: string, password: string, req: Request, res: Response, done: Function) {
    const params = pick(req.query, 'code', 'loginType', 'state')
    try {
        const result = Proxy.api({
            uri: conf.apiPrefix + '/h5/user/wechatAuth',
            data: params,
            secret: conf.secretMap,
        })

        if (loget(result, 'state.code') === 0) {

            const user = extend(
                { userType: 'weixin' },
                loget(result, 'data.user', {}))

            const cookie = loget(result, 'data.cookie')
            if (cookie) {
                res.cookie(jsessionIdCookieKey, cookie, {
                    maxAge: cookieTimeout, // expires * 1000, // 毫秒
                    httpOnly: true,
                })
            }

            done(null, user)
        } else {
            (req as any).tipMessage = loget(result, 'state.msg', '')
            console.error('wx user login response:', JSON.stringify(result))
            done(null, null)
        }
    } catch (err) {
        console.error(err)
    }
}

