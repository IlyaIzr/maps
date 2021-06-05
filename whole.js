require('dotenv').config()
const express = require('express')
const cors = require('cors');
const path = require('path');

// api
const maps = require('./routes/maps')

const app = express()

app.use(express.json())
app.use(cors())
// app.use(cors({
//   origin: 'http://localhost:8000',
//   credentials: true
// }))


// Routes reducers
app.use('/api/maps', maps)

// Host react statics
app.use(express.static(__dirname + '/client/build'));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname + '/client/build', 'index.html'));
});



const port = (+process.env.PORT) || 1414

app.listen(port, () => console.log(`Server is running on port ${port}`))
