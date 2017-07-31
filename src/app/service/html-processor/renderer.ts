import { each, isString } from 'underscore'
import * as Handlebars from 'handlebars'

import { IHtmlProcessOption } from './index'
import conf from '../../../config'

class Renderer {
    /*
     * 对html内容做处理，包括：
     *
     * 填充数据
     * 替换标志变量
     * 插入日志采集
     */
    public render(html: string, options: IHtmlProcessOption) {
        const { fillVars, renderData } = options

        fillVars && this.fillHtmlVars(html, fillVars)
        renderData && this.renderData(html, renderData)
        this.replaceFlagParams(html)
        this.replaceCollectVars(html)
    }

    /* 填充参数到html字符串中 */
    private fillHtmlVars(html: string, fillVars: Object) {
        each(fillVars as any, (val, key) => {
            let jsonV = isString(val) ? val : JSON.stringify(val)
            jsonV = (jsonV || '').replace(/(\u0085)|(\u2028)|(\u2029)/g, '')
            html = html.replace(new RegExp('\\[\\[' + key + '\\]\\]', 'g'), jsonV)
        })
        return html
    }

    /* 渲染模板 */
    private renderData(html, renderData) {
        let template = Handlebars.compile(html)
        return template(renderData || {})
    }

    /* 将html中的flag标识变量作替换 */
    private replaceFlagParams(html: string) {
        html = html.replace('__date', Date.now().toString(32))
        return html
    }

    /* 替换日志采集js-sdk路径和api路径 */
    private replaceCollectVars(html: string) {
        html = html.replace('[[collectjs]]', conf.collectjs)
        html = html.replace('[[collectApiPrefix]]', conf.collectApiPrefix)
        return html
    }
}

export default Renderer
