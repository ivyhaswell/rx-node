export function getUrlParams(url: string = '', key?: string) {
    let queryIndex: number = url.indexOf('?')
    let hashIndex: number = url.indexOf('#')

    let query: string = url.slice(queryIndex + 1, hashIndex < 0 ? url.length : hashIndex)

    if (!query) {
        return key ? '' : {}
    }

    let queries = {}
    let queryArr: string[] = query.split('&')

    queryArr.forEach((val) => {
        let param = val.split('=')
        if (param[0]) {
            queries[param[0]] = param[1]
        }
    })

    return key ? queries[key] : queries
}

export function fillParams(url: string = '', params: any, withouts: any[]) {
    let queries = getUrlParams(url)

    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            if (!withouts) {
                queries[key] = params[key]
            } else if (withouts.indexOf(key) < 0) {
                queries[key] = params[key]
            }
        }
    }

    let queryArr: string[] = []
    for (let key in queries) {
        if (queries.hasOwnProperty(key)) {
            queryArr.push(key + '=' + queries[key])
        }
    }

    const newQuery = '?' + queryArr.join('&')

    let hashIndex: number = url.indexOf('#')

    return hashIndex < 0
        ? url.replace(/\?.*(?=\b)/, newQuery)
        : url.replace(/\?.*(?=\b)#/, newQuery + '#')
}
