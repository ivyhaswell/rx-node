export class Customlog
{
    private prefix: string
    constructor(prefix)
    {
        this.prefix = prefix
    }
    log(msg = '', data = '')
    {
        console.log(`[${this.prefix}] ${msg} ${data}`)
    }
    error(msg = '', err = '')
    {
        console.error(`[${this.prefix}] ${msg} ${err}`)
    }
}
