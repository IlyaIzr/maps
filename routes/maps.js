const express = require('express');
const router = express.Router()
const Connection = require('../db/connection')
const dbConn = new Connection()


// @ api/maps/reviews

router.get('/reviews', async (req, res) => {
  const { targetId } = req.query
  if (!targetId) return res.json({ status: 'OK', data: [] })

  try {
    const query = `
    SELECT reviews.*, users.name, users.login FROM reviews
    LEFT JOIN users ON reviews.author = users.id
    WHERE reviews.targetId = ${targetId}
    ORDER BY timestamp DESC `
    const data = await dbConn.query(query)
    //TODO // LIMIT 10 OFFSET 10 
    return res.json({ status: 'OK', data })
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, err })
  }
})

// @ api/maps/places?minx=1&miny=1&maxx=1000&maxy=1000

router.get('/places', async (req, res) => {
  const minx = req.query.minx || 0
  const miny = req.query.miny || 0
  const maxx = req.query.maxx || 99999999
  const maxy = req.query.maxy || 99999999
  const args = [minx, maxx, miny, maxy]

  try {
    const data = await dbConn.query("SELECT * FROM places WHERE x BETWEEN ? AND ? AND y BETWEEN ? AND ?", args)
    return res.json({ status: 'OK', data })
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, err })
  }
})

// @ api/maps/postInitReview

router.post('/postInitReview', async (req, res) => {
  const { user, review, place } = req.body
  const { grade, comment, targetId } = review

  // Form review query
  const query = 'INSERT INTO `reviews` (`targetId`, `author`, `grade`, `comment`) VALUES (?, ?, ?, ?);'
  const params = [targetId, user, grade, comment]

  // Post review
  try {
    await dbConn.query(query, params)
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, query })
  }

  // Initialize place

  const { x, y, lng, lat, polyString, name } = place
  console.log('%c⧭', 'color: #e57373', name);


  const query1 =
    'INSERT INTO `places` (`id`, `rating`,`name`, `amount`, `x`, `y`, `lng`, `lat`, `polygon`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ST_MPointFromText(?));'
  const params1 = [targetId, grade, name, 1, x, y, lng, lat, polyString]

  // Post place
  try {
    await dbConn.query(query1, params1)
    return res.json({ status: 'OK', msg: 'Review posted successfully' })
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, query1, params1 })
  }
})

// @ api/maps/postNextReview

router.post('/postNextReview', async (req, res) => {
  const { user, review, place } = req.body
  const { grade, comment, targetId } = review

  // Form review query
  const query = 'INSERT INTO `reviews` (`targetId`, `author`, `grade`, `comment`) VALUES (?, ?, ?, ?);'
  const params = [targetId, user, grade, comment]

  // Post review
  try {
    await dbConn.query(query, params)
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, query })
  }

  // Update place

  const { id, rating, amount } = place
  const updatedRating = (amount * rating + grade) / (amount + 1)
  const query1 =
    `UPDATE places set rating=${updatedRating}, amount=${amount + 1} WHERE id=${id};`

  // Post it
  try {
    await dbConn.query(query1)
    return res.json({ status: 'OK', msg: 'Review posted successfully' })
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, query1 })
  }
})


router.post('/postPlaceName', async (req, res) => {
  const { name, id } = req.body


  const query1 =
    `UPDATE places set name='${name}' WHERE id=${id};`

  // Post it
  try {
    await dbConn.query(query1)
    return res.json({ status: 'OK', msg: 'Review posted successfully' })
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, query1 })
  }
})

// @ /maps/test

router.get('/test', async (req, res) => {
  try {
    const data = await dbConn.query("SELECT * FROM places")
    return res.json({ status: 'OK', msg: 'Review posted successfully', data })
  } catch (error) {
    return res.json({ status: 'ERR', msg: error })
  }
})

module.exports = router