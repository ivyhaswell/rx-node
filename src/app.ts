/*
 * @Author: shuwen.wang
 * @Date: 2017-07-11 18:14:23
 * @Last Modified by: shuwen.wang
 * @Last Modified time: 2017-07-11 19:15:31
 */
import * as express from 'express'

const app = module.exports = express()

app.get('/', count)

let times = 0
function count(req, res)
{
    console.log('hit')
    res.send('viewed ' + (times++) + ' times\n')
}

app.listen(3000)
console.log('Express started on port 3000')