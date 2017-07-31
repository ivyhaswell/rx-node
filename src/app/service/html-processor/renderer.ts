import { each, isString } from 'underscore'
import * as Handlebars from 'handlebars'

import { IHtmlProcessOption } from './index'
import conf from '../../../config'

class Renderer {

    private html: string

    /*
     * 对html内容做处理，包括：
     *
     * 填充数据
     * 作为handlebars模板渲染(暂时不启用)
     * 替换标志变量
     * 插入日志采集
     */
    public render(html: string, options: IHtmlProcessOption) {
        this.html = html
        const { fillVars, renderData } = options
        if (fillVars) {
            this.fillHtmlVars(fillVars)
        }
        // this.renderData(renderData)
        this.replaceFlagParams()
        this.replaceCollectVars()
        return this.html
    }

    /* 填充参数到html字符串中 */
    private fillHtmlVars(fillVars: Object) {
        each(fillVars as any, (val, key) => {
            let jsonV = isString(val) ? val : JSON.stringify(val)
            jsonV = (jsonV || '').replace(/(\u0085)|(\u2028)|(\u2029)/g, '')
            this.html = this.html.replace(new RegExp('\\[\\[' + key + '\\]\\]', 'g'), jsonV)
        })
    }

    /* 渲染模板 */
    private renderData(renderData) {
        let template = Handlebars.compile(this.html)
        this.html = template(renderData || {})
    }

    /* 将html中的flag标识变量作替换 */
    private replaceFlagParams() {
        this.html = this.html.replace('__date', Date.now().toString(32))
    }

    /* 替换日志采集js-sdk路径和api路径 */
    private replaceCollectVars() {
        this.html = this.html
            .replace('[[collectjs]]', conf.collectjs)
            .replace('[[collectApiPrefix]]', conf.collectApiPrefix)
    }
}

export default Renderer
