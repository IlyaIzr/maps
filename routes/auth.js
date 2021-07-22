// boiler
const express = require('express');
const router = express.Router()
const Connection = require('../db/connection')
const dbConn = new Connection()
// rest
const bcrypt = require('bcrypt');



// @ api/maps/reviews

router.post('/login', async (req, res) => {
  const { login, pword } = req.body
  if (!login || !pword) return res.json({ status: 'ERR' })

  // fetch user
  try {
    const res = await dbConn.query("SELECT * FROM users WHERE `login` = ?", [login])
    if (!res[0]) return res.json({ status: 'WRONG' })
    var user = res[0]
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, err })
  }

  // compare hash
  const compared = await bcrypt.compare(pword, user.pword)
  if (!compared) return res.json({ status: 'WRONG' })

  delete user.pword
  delete user.question
  delete user.answer
  return res.json({ status: 'OK', data: { ...user } })
})


module.exports = router