// boiler
const express = require('express');
const router = express.Router()
const Connection = require('../db/connection')
const dbConn = new Connection()
// rest
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOAUTHCLIENTID);


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

// @ api/auth/glogin

router.post('/glogin', async (req, res) => {
  const withBearer = req.header('authorization');
  const token = withBearer && withBearer.split(' ')[1]

  if (!token) return res.status(403)

  const { name, avatar, gmail } = req.body


  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOAUTHCLIENTID
  });
  const payload = ticket.getPayload();
  const googleId = payload['sub'];

  if (!googleId) return res.json({ status: 'ERR', msg: 'no user id from google' })

  // fetch user
  try {
    const res = await dbConn.query("SELECT * FROM users WHERE `id` = ?", [googleId])
    // if (!res[0]) return res.json({ status: 'FIRSTTIME', msg: 'make the registration call' })
    var user = res[0]
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, err })
  }

  // Case registration
  const returnedCreds = {
    name, avatar, login: gmail.split('@')[0]
  }
  if (!user) return res.json({ status: 'FIRSTTIME', msg: 'proceed with the registration', data: returnedCreds })

  // Case just login
  delete user.pword
  delete user.question
  delete user.answer

  res.cookie('mp/auth', user.id, {
    httpOnly: true,
    expires: new Date(new Date().setDate(new Date().getDate() + 7)),
    secure: true
  })

  res.json({ status: 'OK', data: { ...user } })
})


module.exports = router