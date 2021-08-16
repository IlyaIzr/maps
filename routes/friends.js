// boiler
const express = require('express');
const router = express.Router()
const Connection = require('../db/connection')
const dbConn = new Connection()
const { auth } = require('./middleware')


// @ api/friends/all

router.get('/all', auth, async (req, res) => {
  const author = req.userId

  const query = `SELECT * FROM friends WHERE id1 = '${author}' OR id2 = '${author}'`

  const joinQuery = `
    SELECT friends.*, users.name, users.login, users.id, users.level FROM friends
    LEFT JOIN users ON friends.id1 = users.id OR friends.id2 = users.id`
  // const query = `
  // SELECT friends.*, users.name, users.login, users.id, users.level FROM friends
  // LEFT JOIN users ON friends.id1 = users.id`
  try {
    const data = await dbConn.query(query)
    return res.json({ status: 'OK', data })
  } catch (error) {
    return res.json({ status: 'ERR', msg: error, query })
  }
})



// @ api/friends/search

router.get('/search', auth, async (req, res) => {
  const { input } = req.query
  if (!input) return res.json({ status: 'OK', data: [] })

  const query = `SELECT id, login, name, level, avatar FROM users WHERE login LIKE '%${input}%' OR name LIKE '%${input}%'`
  try {
    const data = await dbConn.query(query)
    return res.json({ status: 'OK', data })
  } catch (error) {
    return res.json({ status: 'ERR', msg: error, query })
  }
})

module.exports = router