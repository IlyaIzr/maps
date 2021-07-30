// boiler
const express = require('express');
const router = express.Router()
const Connection = require('../db/connection')
const dbConn = new Connection()
const { auth } = require('./middleware')
// rest
const crypto = require('crypto');
const bcrypt = require('bcrypt');




// @ api/users/register

router.post('/register', async (req, res) => {
  const data = req.body
  const { login, pword, name, question, answer } = data
  const level = req.body.level || 1
  if (pword === 'google') return res.json({ status: 'BANEDPWORD', data: pword })
  const id = crypto.randomUUID().replaceAll('-', '')

  // Check for existing user
  const existing = await dbConn.query("SELECT * FROM users WHERE `login` = ? OR `id` = ?", [login, id])
  if (existing.length) return res.json({ status: 'EXISTING', login })

  // hash pword
  const hashed = await bcrypt.hash(pword, 10)

  // Form review query
  const query = 'INSERT INTO `users` (`id`, `login`, `pword`, `name`, `question`, `answer`, `level`) VALUES (?, ?, ?, ?, ?, ?, ?);'
  const params = [id, login, hashed, (name || login), question, answer, level]

  // TODO do we need to send cookie right after?
  // Post review
  try {
    await dbConn.query(query, params)
    res.cookie('mp/auth', id, {
      httpOnly: true,
      expires: new Date(new Date().setDate(new Date().getDate() + 7)),
      secure: true
    })
    return res.json({ status: 'OK', msg: 'User registred successfully', data: { id, login, name, level } })
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, query })
  }
})

router.post('/gregister', async (req, res) => {
  const data = req.body
  const { login, name, id, avatar } = data

  // Check for existing user
  const existing = await dbConn.query("SELECT * FROM users WHERE `login` = ?", [login])
  if (existing.length) return res.json({ status: 'EXISTING', login })

  // Form review query
  const query = 'INSERT INTO `users` (`id`, `login`, `pword`, `name`, `avatar`) VALUES (?, ?, ?, ?, ?);'
  const params = [id, login, 'google', (name || login), avatar]

  // Post review
  try {
    await dbConn.query(query, params)

    res.cookie('mp/auth', id, {
      httpOnly: true,
      expires: new Date(new Date().setDate(new Date().getDate() + 7)),
      secure: true
    })
    return res.json({ status: 'OK', msg: 'User registred successfully', data: { id, login, name, level: 1, avatar } })
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, query })
  }
})


// @ api/users/update

router.post('/update', auth, async (req, res) => {
  const id = req.userId
  const { login, pword, name } = req.body

  // get user info
  const users = await dbConn.query("SELECT * FROM users WHERE `id` = ?", [id])
  const user = users[0]
  if (!user) return res.json({ status: 'REAUTH' })

  // Case password change
  const userData = { ...user }
  delete userData.pword
  delete userData.answer
  if (pword) return res.json({ status: 'PWORDCHANGE', data: userData })

  // Case login change
  if (login !== user.login) {
    const existing = await dbConn.query("SELECT * FROM users WHERE `login` = ?", [login])
    if (existing.length) return res.json({ status: 'EXISTING', data: { login } })
  }

  // Case pword first-time set for google account
  if (user.pword === 'google') {
    const hashed = await bcrypt.hash(pword, 10)
    try {
      await dbConn.query(`UPDATE users set login='${login}', name='${name}', pword='${hashed}' WHERE id='${id}'`)
      return res.json({ status: 'OK', msg: 'User updated successfully', data: { login, name } })
    } catch (err) {
      return res.json({ status: 'ERR', msg: err, query })
    }
  }

  // Update user
  const query = `UPDATE users set login='${login}', name='${name}' WHERE id='${id}'`
  try {
    await dbConn.query(query)
    return res.json({ status: 'OK', msg: 'User updated successfully', data: { login, name } })
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, query })
  }
})

// @ api/users/update

router.post('/updatePword', auth, async (req, res) => {
  const id = req.userId
  const { login, pword, name, answer } = req.body

  if (pword === 'google') return res.json({ status: 'BANEDPWORD', data: pword })

  // get user info
  const users = await dbConn.query("SELECT * FROM users WHERE `id` = ?", [id])
  const user = users[0]
  if (!user || user.answer !== answer) return res.json({ status: 'REAUTH' })

  // Case login change
  if (login !== user.login) {
    const existing = await dbConn.query("SELECT * FROM users WHERE `login` = ?", [login])
    if (existing.length) return res.json({ status: 'EXISTING', data: { login } })
  }

  const hashed = await bcrypt.hash(pword, 10)
  // Update user
  const query = `UPDATE users set login='${login}', name='${name}', pword='${hashed}' WHERE id='${id}'`
  try {
    await dbConn.query(query)
    return res.json({ status: 'OK', msg: 'User updated successfully', data: { login, name } })
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, query })
  }
})


module.exports = router