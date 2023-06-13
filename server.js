const fs = require('fs').promises;
require('dotenv').config()
const express = require('express')
const cors = require('cors');
const cookieP = require('cookie-parser')

// api
const maps = require('./routes/maps')
const reviews = require('./routes/reviews')
const auth = require('./routes/auth')
const users = require('./routes/users')
const settings = require('./routes/settings')
const friends = require('./routes/friends')
const tags = require('./routes/tags')
const { router: cities } = require('./routes/cities');
const { clientBuildLocation } = require('./settings');
// rest
const { appLanguages } = settings

const app = express()
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:1414', 'https://our-maps-be.onrender.com/'],
  // origin: '*',
  credentials: true,
  // optionsSuccessStatus: 200,
  // methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH', 'OPTIONS']
}))

app.use(cookieP(process.env.COOKIE))
app.use(express.json())


// Routes reducers
app.use('/api/maps', maps)
app.use('/api/reviews', reviews)
app.use('/api/auth', auth)
app.use('/api/users', users)
app.use('/api/settings', settings)
app.use('/api/friends', friends)
app.use('/api/tags', tags)
app.use('/api/cities', cities)

app.get('/', async function (req, res) {
  const indexFile = await languageSetter(req, res)
  res.send(indexFile)
})

// Host react statics
app.use(express.static(__dirname + clientBuildLocation));


app.get('*', async (req, res) => {
  const indexFile = await languageSetter(req, res)
  res.send(indexFile)
});

async function languageSetter(request, response) {
  const lang = (function () {
    const preferredLang = request.cookies['mp/lang']
    if (preferredLang && preferredLang in appLanguages) return preferredLang

    const langs = request.acceptsLanguages()
    if (!langs) return 'en'
    for (let i = 0; i < langs.length; i++) {
      const element = langs[i];
      if (element.length === 2) return element
    }
    return 'en'
  })()

  let indexFile = await fs.readFile(__dirname + `${clientBuildLocation}/index.html`, 'utf-8')

  indexFile = indexFile.replace('html lang="en"', `html lang="${lang}"`)
  if (lang === 'ru') indexFile = indexFile.replace('OurMaps', `Наши карты`)

  return indexFile
}


const port = (+process.env.PORT) || 1414

app.listen(port, () => console.log(`Server started at port ${port}, ${new Date()}`))
