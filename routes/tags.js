const express = require('express');
const router = express.Router()
const Connection = require('../db/connection')
const dbConn = new Connection()
// rest

// @ /tags/search?input=abob

router.get('/search', async (req, res) => {
  const { input } = req.query
  if (!input) return res.json({ status: 'OK', data: [] })

  const query = `SELECT * FROM tags WHERE tag LIKE '%${input}%'`
  try {
    const data = await dbConn.query(query)
    return res.json({ status: 'OK', data })
  } catch (error) {
    console.log('%c⧭', error);
    return res.json({ status: 'ERR', msg: error, query })
  }
})

// @ /tags/getTag?tag=peppa

router.get('/getTag', async (req, res) => {
  const { tag } = req.query
  if (!tag) return res.json({ status: 'ERR' })

  // TBC join
  const query = `SELECT * FROM tags WHERE tag = '${tag}' ORDER BY amount DESC`
  try {
    const data = await dbConn.query(query)
    return res.json({ status: 'OK', data })
  } catch (error) {
    console.log('%c⧭', error);
    return res.json({ status: 'ERR', msg: error, query })
  }
})

// @ /tags/getTag?tag=peppa

router.get('/featuredTags', async (req, res) => {
  const data = {}

  const popular = `SELECT * FROM tagsIndex ORDER BY amount DESC LIMIT 10`
  const latter = `SELECT * FROM tagsIndex ORDER BY created DESC LIMIT 10`
  try {
    data.popular = await dbConn.query(popular)
    data.recent = await dbConn.query(latter)
    return res.json({ status: 'OK', data })
  } catch (error) {
    console.log('%c⧭', error);
    return res.json({ status: 'ERR', msg: error, query })
  }
})

// @ /tags/tagSuggestions?input=peppa

router.get('/tagSuggestions', async (req, res) => {
  const { input } = req.query

  const query = `SELECT tag, amount FROM tagsIndex WHERE tag LIKE '%${input}%' ORDER BY amount DESC LIMIT 3`
  try {
    const data = await dbConn.query(query)
    return res.json({ status: 'OK', data })
  } catch (error) {
    console.log('%c⧭', error);
    return res.json({ status: 'ERR', msg: error, query })
  }
})

// @ /tags/postTags

router.post('/postTags', async (req, res) => {
  const { user, placeId, tags } = req.body
  let tagsQuery
  let tIndexQuery

  try {
    for await (const tag of tags) {

      tagsQuery = `
      INSERT INTO tags (tagPlace, tag, placeId, amount)
      VALUES('${tag + placeId}', '${tag}', ${placeId}, 1)
      ON DUPLICATE KEY UPDATE 
      amount = amount + 1
      `
      tIndexQuery = `
      INSERT INTO tagsIndex (tag, amount, created, creator)
      VALUES('${tag}', 1, ${Date.now()}, '${user}')
      ON DUPLICATE KEY UPDATE
      amount = amount + 1
      `

      await dbConn.query(tagsQuery)
      await dbConn.query(tIndexQuery)
    }
    return res.json({ status: 'OK' })

  } catch (error) {
    console.log('err: ', error);
    return res.json({ status: 'ERR', msg: error, tagsQuery, tIndexQuery })
  }

})


module.exports = router