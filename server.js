const fs = require('fs').promises;
require('dotenv').config()
const express = require('express')
const cors = require('cors');
const cookieP = require('cookie-parser')

// api
const maps = require('./routes/maps')
const auth = require('./routes/auth')
const users = require('./routes/users')
const settings = require('./routes/settings')
const friends = require('./routes/friends')
// rest
const { appLanguages } = settings

const app = express()

app.use(cookieP(process.env.COOKIE))
app.use(express.json())
app.use(cors({
  origin: ['http://localhost:3000', 'https://m4ps.herokuapp.com/'],
  credentials: true
}))


// Routes reducers
app.use('/api/maps', maps)
app.use('/api/auth', auth)
app.use('/api/users', users)
app.use('/api/settings', settings)
app.use('/api/friends', friends)

// Host react statics
app.use(express.static(__dirname + '/client/build'));

app.get('*', async function (request, response) {
  const lang = (function () {
    const preferedLang = request.cookies['mp/lang']
    if (preferedLang && preferedLang in appLanguages) return preferedLang

    const langs = request.acceptsLanguages()
    if (!langs) return 'en'
    for (let i = 0; i < langs.length; i++) {
      const element = langs[i];
      if (element.length === 2) return element
    }
    return 'en'
  })()

  let indexFile = await fs.readFile(__dirname + '/client/build/index.html', 'utf-8')

  indexFile = indexFile.replace('html lang="en"', `<html lang="${lang}">`)
  indexFile = indexFile.replace('<script src="./fallbackLanguage.js">', `<script src="./${lang}.js">`)

  return response.send(indexFile)
});


const port = (+process.env.PORT) || 1414

app.listen(port, () => console.log(`Server is running on port ${port}`))
