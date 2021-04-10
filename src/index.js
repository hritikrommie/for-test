const express = require('express')
require('./db/mongoose.js')

const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')

const hospRouter = require('./router/hosp')
const patRouter = require('./router/patient')

const app = express()
const port  = process.env.PORT


app.use(express.json())
app.use(bodyParser.urlencoded())
app.use(hospRouter)
app.use(patRouter)


const public  = path.join(__dirname,'../public')
const viewpath = path.join(__dirname,'../templates/views')
const partialpath = path.join(__dirname,'../templates/partials')

app.set('view engine','hbs')
app.use(express.static(public))
app.set('views',viewpath)
hbs.registerPartials(partialpath)

app.get('', (req,res)=>{
    res.render('index')
})


app.listen(port,()=>{
    console.log('server is up on port '+port)
}) 