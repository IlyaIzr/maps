// boiler
const express = require('express');
const router = express.Router()
const Connection = require('../db/connection')
const dbConn = new Connection()
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


module.exports = router