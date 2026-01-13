const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose') 
require('dotenv').config()
const userRoutes = require('./routes/user_routes')

const { MONGODB_URI, PORT } = process.env

const app = express()

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(MONGODB_URI)

const connection = mongoose.connection
connection.once('open', () => {
    console.log("MongoDB database connection established successfully")
})

app.use('/', userRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})