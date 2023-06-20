// boiler
const express = require('express');
const router = express.Router()
const Connection = require('../db/connection')
const dbConn = new Connection()
// rest
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const DeviceDetector = require("device-detector-js");
const { getRootUsername, clearUserCookie } = require('./helpres');
const { authCookieName } = require('../settings');
const deviceDetector = new DeviceDetector();
const client = new OAuth2Client(process.env.GOAUTHCLIENTID);



// @ api/auth/login

router.post('/login', async (req, res) => {

  const { login, pword } = req.body
  if (!login || pword === 'google') return res.json({ status: 'ERR' })

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
  user.isRoot = Boolean(getRootUsername(user.id))

  res.cookie(authCookieName, user.id, {
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
  (async function storeVisit() {
    const UA = req.headers['user-agent']
    if (!UA) return;
    const deviceInfo = deviceDetector.parse(req.headers['user-agent'])
    const { device = {}, os = {}, client = {} } = deviceInfo;
    const deviceData = device ? `${device.type} ${device.brand}` : 'no device info provided'
    const info = `${deviceData}$  ${os?.name} ${os?.version}, - ${client?.name} ${client?.version}`
    try {
      await dbConn.query(`
      INSERT INTO visits ( ip, time, amount, info ) 
      VALUES ( '${req.ip}', ${Date.now()}, 1, '${info}')
      ON DUPLICATE KEY UPDATE 
      time =  ${Date.now()}, 
      amount = (amount + 1),
      info = '${info}',
      timestamp = CURRENT_TIMESTAMP()
    `)
    } catch (error) {
      console.log(error)
    }
  })()

  const userId = req.cookies[authCookieName]
  if (!userId) return clearUserCookie(res)

  // fetch user
  try {
    const usersResult = await dbConn.query("SELECT * FROM users WHERE `id` = ?", [userId])
    var user = usersResult[0]
    if (!user) return clearUserCookie(res)
    delete user.pword
    delete user.question
    delete user.answer
  } catch (err) {
    console.log(err)
    return res.json({ status: 'ERR', msg: err, err })
  }

  res.cookie(authCookieName, user.id, {
    httpOnly: true,
    expires: new Date(new Date().setDate(new Date().getDate() + 23)),
    secure: true
  })

  user.isRoot = Boolean(getRootUsername(user.id))
  res.json({ status: 'OK', data: user })
})


// @ api/auth/logout

router.get('/logout', async (req, res) => {
  res.cookie(authCookieName, '', {
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

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOAUTHCLIENTID
  });
  const payload = ticket.getPayload();
  const googleId = payload['sub'];
  const userEmail = payload.email
  const userAvatar = payload.picture
  const userName = `${payload.name} ${payload.given_name}`.trimEnd()

  if (!googleId) return res.json({ status: 'ERR', msg: 'no user id from google' })

  // fetch user
  let user
  try {
    const res = await dbConn.query("SELECT * FROM users WHERE `id` = ?", [googleId])
    user = res[0]
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, err })
  }

  // Case registration
  // return available login or else empty login field
  const existingLoginCall = await dbConn.query("SELECT * FROM users WHERE `login` = ?", [userEmail])
  const login = existingLoginCall.length > 0 ? '' : userEmail.split('@')[0]

  const returnedCreds = { name: userName, avatar: userAvatar, login, id: googleId, email: userEmail }
  if (!user) return res.json({ status: 'FIRSTTIME', msg: 'proceed with the registration', data: returnedCreds })

  // Case just login
  delete user.pword
  delete user.question
  delete user.answer

  res.cookie(authCookieName, user.id, {
    httpOnly: true,
    expires: new Date(new Date().setDate(new Date().getDate() + 23)),
    secure: true
  })

  user.isRoot = Boolean(getRootUsername(user.id))
  res.json({ status: 'OK', data: { ...user } })
})


module.exports = router