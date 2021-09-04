const express = require('express');
const router = express.Router()
const Connection = require('../db/connection')
const dbConn = new Connection()
// rest
const { auth } = require('./middleware')



// @ api/reviews/reviews

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



// @ api/reviews/postReview

// change table to have id
// ALTER TABLE `places`
// MODIFY COLUMN `id` INT(10) PRIMARY KEY 
function notNaN(val) {
  if (!val && typeof val === 'number' && val !== 0) return 0
  return val
}

router.post('/postReview', async (req, res) => {
  const { userId, review, place } = req.body
  const { grade, comment, targetId } = review
  const { x, y, lng, lat, polyString, name } = place
  // next rew
  const { rating, amount } = place
  const updatedRating = (amount * rating + grade) / (amount + 1)

  // upsert into db
  const placesQuery = `
  INSERT INTO places
  ( id, rating,name, amount, x, y, lng, lat, polygon ) 
  VALUES 
  ( ${targetId}, '${grade || 0}', '${name}', '${1}', '${x || 0}', '${y || 0}', '${lng || 0}', '${lat || 0}', ST_MPointFromText('${polyString}') )
  ON DUPLICATE KEY UPDATE 
  rating = '${notNaN(updatedRating)}', amount = '${notNaN(amount + 1)}'
  `

  try {
    await dbConn.query(placesQuery)
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, query: placesQuery })
  }

  const reviewQuery = `
  INSERT INTO reviews 
  (targetId, author, grade, comment, timestamp) 
  VALUES (${targetId}, '${userId}', ${grade}, '${comment}', ${Date.now()})
  `

  try {
    await dbConn.query(reviewQuery)
    return res.json({ status: 'OK', msg: 'Review posted successfully' })
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, query: reviewQuery })
  }

})



// @ /reviews/reviews

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


module.exports = router