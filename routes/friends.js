// boiler
const express = require('express');
const router = express.Router()
const Connection = require('../db/connection')
const dbConn = new Connection()
const { auth } = require('./middleware')


// @ api/friends/all

router.get('/all', auth, async (req, res) => {
  const author = req.userId

  // const query = `SELECT * FROM friends WHERE id1 = '${author}' OR id2 = '${author}'`

  const query = `
  SELECT users.id, users.login, users.name, users.commentsn, users.level, users.avatar, friends.*
  FROM users
  LEFT JOIN friends
  ON (friends.id1 = '${author}' AND friends.id2 = users.id)
  OR (friends.id2 = '${author}' AND friends.id1 = users.id)
  WHERE friends.status1 > 0 AND friends.status2 > 0
  `

  try {
    const data = await dbConn.query(query)
    return res.json({ status: 'OK', data })
  } catch (error) {
    return res.json({ status: 'ERR', msg: error, query })
  }
})

// @ api/friends/requests

router.get('/requests', auth, async (req, res) => {
  const author = req.userId

  // const query = `SELECT * FROM friends WHERE id1 = '${author}' OR id2 = '${author}'`

  const query = `
  SELECT users.id, users.login, users.name, users.commentsn, users.level, users.avatar, friends.*
  FROM users
  LEFT JOIN friends
  ON (friends.id1 = '${author}' AND friends.id2 = users.id)
  OR (friends.id2 = '${author}' AND friends.id1 = users.id)
  WHERE (friends.id1 = '${author}' AND friends.status1 = 0 AND friends.status2 > 0)
  OR (friends.id2 = '${author}' AND friends.status2 = 0 AND friends.status1 > 0)
  `

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

// @ api/friends/details

router.get('/details', auth, async (req, res) => {
  const { id } = req.query
  if (!id) return res.json({ status: 'OK', data: [] })
  const author = req.userId

  if (author === id) return res.json({ status: 'ERR' })

  const query = `
  SELECT friends.*, users.id, users.login, users.name, users.commentsn, users.level, users.avatar 
  FROM users 
  LEFT JOIN friends 
  ON (friends.id2 = '${author}' AND users.id = friends.id1) 
  OR (friends.id1 = '${author}' AND users.id = friends.id2)
  WHERE users.id = '${id}' 
  `
  try {
    const data = await dbConn.query(query)
    if (!data[0]) throw 'no matching fields #6362'
    const user = data[0]

    if (!user.id1) user.friendStatus = 'init'
    else if (user.status1 && user.status2) user.friendStatus = 'friends'
    else if (user.id1 === author && user.status1) user.friendStatus = 'youRequested'
    else if (user.id1 === author && user.status2) user.friendStatus = 'youAsked'
    else if (user.id2 === author && user.status2) user.friendStatus = 'youRequested'
    else if (user.id2 === author && user.status1) user.friendStatus = 'youAsked'
    else user.friendStatus = 'some error'

    return res.json({ status: 'OK', data: user })
  } catch (error) {
    return res.json({ status: 'ERR', msg: error, query })
  }
})

// @ api/friends/add
// send if there's no init friendshop connection

router.get('/add', auth, async (req, res) => {
  const { id } = req.query
  if (!id) return res.json({ status: 'ERR' })
  const author = req.userId

  const query = 'INSERT INTO `friends` (`id1`, `id2`, `status1`, `status2`, `timestamp`) VALUES (?, ?, ?, ?, ?);'
  try {
    await dbConn.query(query, [author, id, true, false, Date.now()])
    return res.json({ status: 'OK' })
  } catch (error) {
    return res.json({ status: 'ERR', msg: error, query })
  }
})


// @ api/friends/remove

router.get('/remove', auth, async (req, res) => {
  const { id: unfriendId } = req.query
  if (!unfriendId) return res.json({ status: 'ERR' })
  const author = req.userId
  if (author === unfriendId) return res.json({ status: 'ERR' })


  const query = `
  UPDATE friends 
  SET status1 = IF(id1 = '${author}' AND id2 = '${unfriendId}', false, status1),
      status2 = IF(id2 = '${author}' AND id1 = '${unfriendId}', false, status2)
  WHERE (id1 = '${author}' AND id2 = '${unfriendId}')
  OR (id2 = '${author}' AND id1 = '${unfriendId}')
  `
  try {
    await dbConn.query(query)
    return res.json({ status: 'OK' })
  } catch (error) {
    console.log('%c⧭', 'color: #cc7033', error);
    return res.json({ status: 'ERR', msg: error, query })
  }
})

// @ api/friends/accept

router.get('/accept', auth, async (req, res) => {
  const { id: befriendID } = req.query
  if (!befriendID) return res.json({ status: 'ERR' })
  const author = req.userId
  if (author === befriendID) return res.json({ status: 'ERR' })


  const query = `
  UPDATE friends 
  SET status1 = IF(id1 = '${author}' AND id2 = '${befriendID}', true, status1),
      status2 = IF(id2 = '${author}' AND id1 = '${befriendID}', true, status2)
  WHERE (id1 = '${author}' AND id2 = '${befriendID}')
  OR (id2 = '${author}' AND id1 = '${befriendID}')
  `
  try {
    await dbConn.query(query)
    return res.json({ status: 'OK' })
  } catch (error) {
    console.log('%c⧭', 'color: #d0bfff', error);
    return res.json({ status: 'ERR', msg: JSON.stringify(error), query })
  }
})

// @ api/friends/accept

router.get('/addByLink', auth, async (req, res) => {
  const { id: befriendID } = req.query
  if (!befriendID) return res.json({ status: 'ERR' })
  const author = req.userId
  if (author === befriendID) return res.json({ status: 'ERR' })

  const checkQuery = `
  SELECT * FROM friends 
  WHERE (id1 = '${author}' AND id2 = '${befriendID}')
  OR (id2 = '${author}' AND id1 = '${befriendID}')
  `
  try {
    const friendship = await dbConn.query(checkQuery)
    if (friendship[0]) {
      // Case connection established previously
      const query = `
        UPDATE friends 
        SET status1 = true,
            status2 = true
        WHERE (id1 = '${author}' AND id2 = '${befriendID}')
        OR (id2 = '${author}' AND id1 = '${befriendID}')
      `
      await dbConn.query(query)
    }
    else {
      const query = 'INSERT INTO `friends` (`id1`, `id2`, `status1`, `status2`, `timestamp`) VALUES (?, ?, ?, ?, ?);'
      await dbConn.query(query, [author, befriendID, true, true, Date.now()])
    }
    return res.json({ status: 'OK' })
  } catch (error) {
    console.log('%c⧭', 'color: #d0bfff', error);
    return res.json({ status: 'ERR', msg: JSON.stringify(error), query })
  }


})


module.exports = router