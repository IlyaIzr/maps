require('dotenv').config()
const express = require('express')
const cors = require('cors');

// api
const maps = require('./routes/maps')
const auth = require('./routes/auth')
const users = require('./routes/users')

const app = express()

app.use(express.json())
app.use(cors())
// app.use(cors({
//   origin: 'http://localhost:8000',
//   credentials: true
// }))


// Routes reducers
app.use('/api/maps', maps)
app.use('/api/auth', auth)
app.use('/api/users', users)


const port = (+process.env.PORT) || 1414

app.listen(port, () => console.log(`Server is running on port ${port}`))
