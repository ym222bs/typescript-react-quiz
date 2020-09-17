const express = require('express')
const path = require('path')

const app = express()

const PORT = process.env.POST || 3000
app.use(express.static('build'))

app.listen(PORT, () => console.log('Connected on port: ', PORT))
