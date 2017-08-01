export class DurationCaculator
{
    private start
    private end
    constructor()
    {
        this.start = null
        this.end = null
    }
    setStart()
    {
        this.start = process.hrtime()
    }
    setEnd()
    {
        this.end = process.hrtime()
    }
    calc()
    {
        if (!this.start || !this.end) {
            return 0
        } else {
            const duration = (this.end[0] - this.start[0]) * 1e3 + (this.end[1] - this.start[1]) * 1e-6
            this.clean()
            return duration
        }
    }
    clean()
    {
        this.start = null
        this.end = null
    }
}
