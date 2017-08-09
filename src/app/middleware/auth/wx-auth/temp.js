var _ = require('underscore'),
    crypto = require('crypto'),

    auth = require('./auth'),

    envi = require('../../../components/envi/envi'),
    proxy = require('../../../components/proxy/proxy'),
    resProcessor = require('../../../components/res-processor/res-processor'),
    urlUtils = require('../../../components/url-utils/url-utils'),
    wxUtils = require('../../../components/wx-utils/wx-utils'),

    conf = require('../../../conf'),

    cookieTimeout = 60 * 60 * 24 * 1000,

    // 旧项目生成的cookie的sessionId对应的key
    jsessionIdCookieKey = 'QLZB_SESSIONID',

    // sessionid 加密因子
    sessionidFeed = 'QiAnLiAo03251450aES';


/**
 * 根据code验证用户
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-11-30T16:06:13+0800
 * @param    {[type]}                           username [description]
 * @param    {[type]}                           password [description]
 * @param    {[type]}                           req      [description]
 * @param    {[type]}                           res      [description]
 * @param    {Function}                         done     [description]
 * @return   {[type]}                                    [description]
 */
function checkUser(username, password, req, res, done) {
    var params = _.pick(req.query, 'code', 'loginType', 'state');

    proxy.apiProxy(conf.wechatApi.checkLogin, params, function (err, body) {
        if (err) {
            done(err, null);
            return;
        }

        // 验证成功
        if (body && body.state && body.state.code === 0) {
            // 回填usertype标识
            var userObj = _.extend({
                userType: 'weixin', // 标识是微信登录
            }, body.data && body.data.user || {});

            // 兼容旧项目，写入jsession的cookie
            if (body.data && body.data.cookie) {
                res.cookie(jsessionIdCookieKey, body.data.cookie, {
                    maxAge: cookieTimeout, // expires * 1000, // 毫秒
                    httpOnly: true,
                });
            }

            // 成功写入session
            done(null, userObj);

            // 验证失败
        } else {
            req.tipMessage = body && body.state && body.state.msg;
            console.error('wx user login response:', JSON.stringify(body));
            done(null, null);
        }
    }, conf.wechatApi.secret);
}

/**
 * 兼容旧项目使有jessionid验证用户
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-11-30T16:39:23+0800
 * @param    {[type]}                           username [description]
 * @param    {[type]}                           password [description]
 * @param    {[type]}                           req      [description]
 * @param    {[type]}                           res      [description]
 * @param    {Function}                         done     [description]
 * @return   {[type]}                                    [description]
 */
function jsessionIdCheckUser(username, password, req, res, done) {
    var params = {
        cookieValue: req.cookies[jsessionIdCookieKey],
    };
    // 根据jsessionid获取用户信息
    proxy.apiProxy(conf.wechatApi.checkLoginFromJSessionId, params, function (err, body) {
        if (err) {
            done(err, null);
            return;
        }

        // 验证成功
        if (body && body.state && body.state.code === 0) {
            // 回填usertype标识
            var userObj = _.extend({
                userType: 'weixin', // 标识是微信登录
            }, body.data && body.data.user || {});

            // 成功写入session
            done(null, userObj);

            // 验证失败
        } else {
            req.tipMessage = body && body.state && body.state.msg;
            console.error('wx user login response:', JSON.stringify(body));
            done(null, null);
        }
    }, conf.wechatApi.secret);
}


/**
 * 在路由中添加该方法对微信客户端用户登录验证
 * 注：该中间件提供绕过该验证中间件方式------req._skipWxAuth = true;
 * @param  {Object} options 配置项
 *     options.expires           Number           session失效时间，单位秒（s)，选填，默认24小时
 *     options.successRedirect   String           验证成功时的跳转路由字符串。可选，若配置，则跳转到该路由，否则继续执行
 *     options.failureRedirect   String/Function  验证失败时的跳转路由字符串或方法。 若不配置，则不论验证是否通过，均放行
 *     options.allowFree        Boolean     是否放行，若为true,则不登录仍然放行
 * @return {[type]}         [description]
 */
var validate = function (opts) {
    opts = opts || {};

    // 验证用户是否登录
    opts.isLogined = function (req, res) {
        var rs = req.rSession || {};

        // if (!req.rSession) {
        //     return false;
        // }

        // return rs.user && rs.user.userType === 'weixin';
        return rs.user && rs.user.userType === 'weixin';
    };
    // 获取用户信息登录
    opts.checkUser = function (username, password, req, res, done) {
        var code = req.query.code;


        // // 作为本地调试
        if (conf.mode === 'development' && (/(fisher|dodomon)/.test(req.get('Host')) || req.get('Host').indexOf('qlchat') < 0)) {
            // if (conf.mode === 'test' && (req.get('Host').indexOf('qlchat') < 0 || req.get('Host').indexOf('test.') > -1 )) {

            res.cookie(jsessionIdCookieKey, '4F2F79326F6476794335546863587961555A652B4A6171703554387376584370373149576656346B3234733D', {
                // maxAge: 0, //expires * 1000,
                httpOnly: true,
            });

            done(null, {
                'userType': 'weixin', // 标识是微信登录
                'unionId': 'o8YuyszTvnufDrSkFqID1LMFkmtw', // dodomon
                'userId': '100003767000001', // dodomon
                'name': 'dodomon', // dodomon
                'headImgUrl': 'http://img.qlchat.com/qlLive/userHeadImg/7PACRS47-GZ3J-ITWN-1479908935934-DDWBDGYRID5A.jpg', // dodomon
                // 'userId': '100011797000012', // Dylan
                // 'userId': '100002861000330', // Dylan in test1
                // 'userId': '100001205000070',// Dylan in test2
                // 'userId': '100002861000219', //arluber test1
                // 'userId': '100000282000042', //arluber test3
                // 'userId': '100011797000025', // arluber
                // 'userId':'100002551000011',
                // 'userId': '100004544000015', // NANO
                // 'openId': 'o_CZPwLZENsYkFJKd1iyF2BpanHU',
                // 'headImgUrl': 'http://img.qlchat.com/qlLive/userHeadImg/BFD24EAC-D28B-49CF-8CE6-085C42F9B164-FQDJUP1WZX.jpg',// Dylan
                // 'name': 'angry Dylan',
                // "userId":'100005366000053',//uutwo
                // "unionId":"o8Yuys8gWS8FRMLbyWvrKxmcCr6Q",//uutwo
                // "headImgUrl": "https://img.qlchat.com/qlLive/userHeadImg/cea736e5-5a7b-457a-81ea-7a46b583f014-IVT5X862TH.jpg",//uutwo
                // "name": "uutwo",//uutwo
                'account': null,
                'mobile': null,
                'email': null,
                'appId': null,
                'mgForums': [],
                'mgLives': [],
            });

            return;
        }

        // 当旧项目完全迁移后可删除以下机制
        // 此处添加兼容旧项目session验证登录机制
        if (!code && req.cookies[jsessionIdCookieKey]) {
            jsessionIdCheckUser(username, password, req, res, done);
        } else if (code) {
            // 根据微信授权码(req.query.code)获取用户信息验证
            checkUser(username, password, req, res, done);
        } else {
            done(null, null);
        }
    };

    // 默认跳转失败时去到的页面
    opts.failureRedirect = opts.failureRedirect || function (req, res, next) {
        var path = req.path,
            isApi = path.indexOf('/api/') > -1,
            ua = (req.headers['user-agent'] || '').toLowerCase(),
            wxLoginPageUrl = '/page/login';


        // 接口调用
        if (isApi) {
            req.authFailureData = {
                state: {
                    code: 110,
                    msg: '无权限访问',
                },
                data: {
                    url: '/page/login',
                },
            };
            resProcessor.forbidden(req, res, req.authFailureData);

            // 页面访问
        } else {
            var pageUrl = (conf.mode === 'prod' ? 'https' : req.protocol) + '://' + req.get('Host') + req.originalUrl;


            // 非微信内置浏览器，使用二维码登录
            if (!envi.isWeixin(req)) {
                pageUrl = urlUtils.fillParams({
                    loginType: 'qrCode',
                }, pageUrl, ['code', 'state', 'authDataKey']);

                // 记录来源页面地址
                req.flash('_loginRedirectUrl', pageUrl);

                // 跳转到微信登录页
                res.redirect(wxLoginPageUrl);
                // }

                // 微信内置浏览器，使用手动授权登录
            } else {

                // 灰度环境借助正式环境登录
                if (pageUrl.indexOf('://test.qlchat.com') > -1) {
                    pageUrl = req.protocol + '://m.qlchat.com/api/go/wx-auth?target=' + encodeURIComponent(pageUrl);
                }

                wxUtils.getAuthLoginUrl(pageUrl, function (url) {
                    res.redirect(url);
                });
            }
        }
    };

    return function (req, res, next) {
        // 提供绕过中间件机制
        if (req._skipWxAuth) {
            next();
            return;
        }

        // 判断为app内访问，则不使用微信登录中间件处理登录
        if (envi.getQlchatVersion(req)) {
            next();
            return;
        }

        // 无验证码 且无wt登录cookie，且中间件开放了允许放行，则放行
        if (opts.allowFree && !req.query.code && !req.cookies[jsessionIdCookieKey]) {
            next();
            return;
        }

        auth.validate(opts)(req, res, next);
    };
};


module.exports = validate;
module.exports.required = auth.required;
module.exports.validate = validate;
