const express = require('express');
const router = express.Router()
const Connection = require('../db/connection')
const dbConn = new Connection()
// rest
const { auth } = require('./middleware')


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
  const minx = Number(req.query.minx || 0)
  const miny = Number(req.query.miny || 0)
  const maxx = Number(req.query.maxx || 99999999)
  const maxy = Number(req.query.maxy || 99999999)
  const args = [minx - 1, maxx + 1, miny - 1, maxy + 1]
  const query = `SELECT * FROM places WHERE x BETWEEN ${args[0]} AND ${args[1]} AND y BETWEEN ${args[2]} AND ${args[3]}`

  try {
    const data = await dbConn.query(query, args)
    return res.json({ status: 'OK', data })
  } catch (err) {
    console.log('%c⧭', 'color: #d0bfff', err);
    return res.json({ status: 'ERR', msg: err, err })
  }
})

// @ api/maps/userPlaces?id=userid

router.get('/userPlaces', async (req, res) => {
  const { id: author } = req.query

  const query = `
  SELECT reviews.targetId, reviews.author, places.*
  FROM reviews
  LEFT JOIN places
  ON reviews.targetId = places.id
  WHERE reviews.author = '${author}'
  `
  try {
    const data = await dbConn.query(query)
    return res.json({ status: 'OK', data })
  } catch (err) {
    console.log('%c⧭', 'color: #cc0036', err);
    return res.json({ status: 'ERR', msg: err, err })
  }
})

// @ api/maps/taggedPlaces?tag=tag

router.get('/taggedPlaces', async (req, res) => {
  const { tag } = req.query
  const minx = Number(req.query.minx || 0)
  const miny = Number(req.query.miny || 0)
  const maxx = Number(req.query.maxx || 99999999)
  const maxy = Number(req.query.maxy || 99999999)
  const args = [minx - 1, maxx + 1, miny - 1, maxy + 1]

  const query = `
  SELECT tags.placeId, places.*
  FROM tags
  LEFT JOIN places
  ON tags.placeId = places.id
  WHERE tags.tag = '${tag}'
  AND places.x BETWEEN ${args[0]} AND ${args[1]} AND places.y BETWEEN ${args[2]} AND ${args[3]}
  `
  try {
    const data = await dbConn.query(query)
    return res.json({ status: 'OK', data })
  } catch (err) {
    console.log(err)
    return res.json({ status: 'ERR', msg: err, err, query })
  }
})



// @ api/maps/placesByTiles

router.post('/placesByTiles', async (req, res) => {
  if (!req.body) return res.json({ status: 'OK', data: [] })

  const xValues = []
  const yValues = []
  Object.values(req.body).forEach(val => {
    const [x, y] = val.substr(1).split('y')
    xValues.push(x)
    yValues.push(y)
  })

  const query = `
  SELECT * FROM places WHERE
  x IN (${xValues.toString()})
  AND
  y IN (${yValues.toString()})
  `

  try {
    const data = await dbConn.query(query)
    return res.json({ status: 'OK', data })
  } catch (err) {
    console.log('%c⧭', 'color: #ff6600', err);
    return res.json({ status: 'ERR', msg: err, err })
  }
})

// @ api/maps/taggedByTiles

router.post('/taggedByTiles', async (req, res) => {
  if (!req.body) return res.json({ status: 'OK', data: [] })
  const { tag, data } = req.body

  const xValues = []
  const yValues = []
  Object.values(data).forEach(val => {
    const [x, y] = val.substr(1).split('y')
    xValues.push(x)
    yValues.push(y)
  })
  
  const query = `
  SELECT tags.placeId, places.*
  FROM tags
  LEFT JOIN places
  ON tags.placeId = places.id
  WHERE tags.tag = '${tag}'
  AND places.x IN (${xValues.toString()})
  AND places.y IN (${yValues.toString()})
  `

  try {
    const data = await dbConn.query(query)
    return res.json({ status: 'OK', data })
  } catch (err) {
    console.log(err);
    return res.json({ status: 'ERR', msg: err, err, query })
  }
})



// @ api/maps/postInitReview

router.post('/postInitReview', async (req, res) => {
  const { user, review, place } = req.body
  const { grade, comment, targetId } = review
  const timestamp = Date.now()

  // Form review query
  const query = 'INSERT INTO `reviews` (`targetId`, `author`, `grade`, `comment`, `timestamp`) VALUES (?, ?, ?, ?, ?);'
  const params = [targetId, user, grade, comment, timestamp]

  // Post review
  try {
    await dbConn.query(query, params)
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, query })
  }

  // Initialize place

  const { x, y, lng, lat, polyString, name } = place


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
  const timestamp = Date.now()

  // Form review query
  const query = 'INSERT INTO `reviews` (`targetId`, `author`, `grade`, `comment`, `timestamp`) VALUES (?, ?, ?, ?, ?);'
  const params = [targetId, user, grade, comment, timestamp]

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


// @ /maps/reviews

router.delete('/reviews', auth, async (req, res) => {

  const author = req.userId
  const { timestamp, place: { rating, amount, id, grade } } = req.body
  // console.log('%c⧭', 'color: #006dcc', rating, amount, id, grade);
  // return res.json({ status: 'OK', msg: 'Review deleted successfully' })
  // Delete review

  const query = `DELETE FROM reviews WHERE author = '${author}' AND timestamp = '${timestamp}'`
  try {
    const result = await dbConn.query(query)
    if (!result.affectedRows) throw 'nothing was deleted'
  } catch (error) {
    return res.json({ status: 'ERR', msg: error, query })
  }


  // Update place
  const updatedRating = (amount * rating - Number(grade)) / (amount - 1)
  const placeQuery =
    `UPDATE places set rating=${updatedRating}, amount=${amount - 1} WHERE id=${id};`

  try {
    const result = await dbConn.query(placeQuery)
    if (result.affectedRows) return res.json({ status: 'OK', msg: 'Review deleted successfully' })
    throw 'nothing was deleted'
  } catch (error) {
    return res.json({ status: 'ERR', msg: error, query: placeQuery })
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