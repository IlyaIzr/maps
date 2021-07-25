// boiler
const express = require('express');
const router = express.Router()
const Connection = require('../db/connection')
const dbConn = new Connection()
// rest
const bcrypt = require('bcrypt');


// @ api/auth/login

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
  if (pword !== user.pword && !compared) return res.json({ status: 'WRONG' })


  delete user.pword
  delete user.question
  delete user.answer

  res.cookie('mp/auth', user.id, {
    // path: "/",
    // domain: "localhost",
    httpOnly: true,
    expires: new Date(new Date().setDate(new Date().getDate() + 7)),
    secure: true
  })

  res.json({ status: 'OK', data: { ...user } })
})

// @ api/auth/refresh

router.get('/refresh', async (req, res) => {
  const userId = req.cookies['mp/auth']
  if (!userId) return res.json({ status: 'REAUTH' })

  // fetch user
  try {
    const res = await dbConn.query("SELECT * FROM users WHERE `id` = ?", [userId])
    if (!res[0]) return res.status(403).json({ status: 'REAUTH' })
    var user = res[0]
    delete user.pword
    delete user.question
    delete user.answer
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, err })
  }

  res.cookie('mp/auth', user.id, {
    httpOnly: true,
    expires: new Date(new Date().setDate(new Date().getDate() + 7)),
    secure: true
  })

  res.json({ status: 'OK', data: user })
})


// @ api/auth/logout

router.get('/logout', async (req, res) => {  
  res.cookie('mp/auth', '', {
    httpOnly: true,
    expires: new Date(1970),
    secure: true
  })

  res.json({ status: 'OK' })
})


module.exports = router