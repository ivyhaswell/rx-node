import conf from '../../../config'
import { fillParams } from '../url-utils'

export function getAuthLoginUrl(redirectUrl) {
    const redirect = encodeURIComponent(fillParams(redirectUrl, {
        loginType: 'auth'
    }, ['code', 'state', 'authDataKey', 'client']))

    return 'https://open.weixin.qq.com/connect/oauth2/authorize' +
        '?appid=' + conf.appId +
        '&redirect_uri=' + redirect +
        '&response_type=code' +
        '&scope=snsapi_userinfo' +
        '&state=' + Date.now() +
        '#wechat_redirect'
}
