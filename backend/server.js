require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

//

const findDriverRoutes = require ('./routes/findDriver')
const userRoutes = require ('./routes/user')

//

const app = express()

// middleware

// necessary to access body
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes paths
app.use('/api/findDriver', findDriverRoutes)
app.use('/api/user', userRoutes)

// connect to mongodb
mongoose.connect(process.env.MONGO_URI).then(() => {
        // listen to request and show port number
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT)
        })
    }).catch((error) => {
        console.log(error)
    })



