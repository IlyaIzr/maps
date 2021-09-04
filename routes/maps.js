const express = require('express');
const router = express.Router()
const Connection = require('../db/connection')
const dbConn = new Connection()


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