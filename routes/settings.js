// boiler
const express = require('express');
const router = express.Router()
// rest
const appLanguages = {
  ru: 'ru',
  en: 'en'
}

// @ api/settings/lang

router.get('/setLang', async (req, res) => {
  let { lang } = req.query

  if (!(lang in appLanguages)) lang = 'en'

  res.cookie('mp/lang', lang, {
    expires: new Date(new Date().setDate(new Date().getDate() + 42)),
  })

  return res.json({ status: 'OK' })
})


module.exports = router
module.exports = Object.assign(module.exports, {
  appLanguages,
});