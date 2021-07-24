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
  const id = crypto.randomUUID().replaceAll('-', '')

  // Check for existing user
  const existing = await dbConn.query("SELECT * FROM users WHERE `login` = ? OR `id` = ?", [login, id])
  if (existing.length) return res.json({ status: 'EXISTING', login })

  // hash pword
  const hashed = await bcrypt.hash(pword, 10)

  // Form review query
  const query = 'INSERT INTO `users` (`id`, `login`, `pword`, `name`, `question`, `answer`) VALUES (?, ?, ?, ?, ?, ?);'
  const params = [id, login, hashed, (name || login), question, answer]

  // Post review
  try {
    await dbConn.query(query, params)
    return res.json({ status: 'OK', msg: 'User registred successfully', data: { id, login, name, level: 1 } })
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
  delete user.pword
  delete user.answer

  // Case password change
  if (pword) return res.json({ status: 'PWORDCHANGE', data: user })

  // Case login change
  if (login !== user.login) {
    const existing = await dbConn.query("SELECT * FROM users WHERE `login` = ?", [login])
    if (existing.length) return res.json({ status: 'EXISTING', data: { login } })
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

  // get user info
  const users = await dbConn.query("SELECT * FROM users WHERE `id` = ?", [id])
  const user = users[0]
  if (!user || user.answer !== answer) return res.json({ status: 'REAUTH' })

  // Case login change
  if (login !== user.login) {
    const existing = await dbConn.query("SELECT * FROM users WHERE `login` = ?", [login])
    if (existing.length) return res.json({ status: 'EXISTING', data: { login } })
  }

  // Update user
  const query = `UPDATE users set login='${login}', name='${name}', pword='${pword}' WHERE id='${id}'`
  try {
    await dbConn.query(query)
    return res.json({ status: 'OK', msg: 'User updated successfully', data: { login, name } })
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, query })
  }
})


module.exports = router