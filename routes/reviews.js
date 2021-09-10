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
    WHERE reviews.targetId = '${targetId}'
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
  const { userId, userLevel, commentsNumber, review, place } = req.body
  const { grade, comment, targetId } = review
  const { x, y, lng, lat, polyString, name } = place

  // upsert into db
  const placesQuery = `
  INSERT INTO places
  ( id, rating,name, amount, x, y, lng, lat, polygon ) 
  VALUES 
  ( '${targetId}', '${grade || 0}', '${name}', '${1}', '${x || 0}', '${y || 0}', '${lng || 0}', '${lat || 0}', ST_MPointFromText('${polyString}') )
  ON DUPLICATE KEY UPDATE 
  rating = ((amount * rating + ${grade}) / (amount + 1)), 
  amount = (amount + 1), 
  polygon = ST_MPointFromText('${polyString}')
  `

  try {
    await dbConn.query(placesQuery)
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, query: placesQuery })
  }

  const reviewQuery = `
  INSERT INTO reviews 
  (targetId, author, grade, comment, timestamp) 
  VALUES ('${targetId}', '${userId}', ${grade}, ?, ${Date.now()})
  `

  let newLevel = null
  try {
    await dbConn.query(reviewQuery, [comment])

    await (async function levelUp() {
      if (userId === 'anonimus' || typeof userLevel === 'undefined' || userLevel === 10) return;

      let commentStep = 2 + (6 * 10)  //amount of comments for level 10
      for (let i = 10; i > 0; i--) {
        if (commentsNumber + 1 >= commentStep) {
          if (i === userLevel) break
          await dbConn.query(`UPDATE users SET level = ${i}, commentsn = ${notNaN(commentsNumber) + 1} WHERE id = '${userId}'`)
          newLevel = i
          break;
        }
        commentStep = 2 + (6 * (i - 1))
      }
    })()
    if (!newLevel && userId !== 'anonimus')
      await dbConn.query(`UPDATE users SET commentsn = ${notNaN(commentsNumber) + 1} WHERE id = '${userId}'`)

    return res.json({ status: 'OK', msg: 'Review posted successfully', newLevel })
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, query: reviewQuery })
  }

})



// @ /reviews/reviews

router.delete('/reviews', auth, async (req, res) => {

  const userId = req.userId
  const { timestamp, place: { id, grade } } = req.body
  // console.log('%c⧭', 'color: #006dcc', rating, amount, id, grade);
  // return res.json({ status: 'OK', msg: 'Review deleted successfully' })
  // Delete review

  const query = `DELETE FROM reviews WHERE author = '${userId}' AND timestamp = '${timestamp}'`
  try {
    const result = await dbConn.query(query)
    if (!result.affectedRows) throw 'nothing was deleted'
    if (userId !== 'anonimus')
      await dbConn.query(`UPDATE users SET commentsn = (commentsn - 1) WHERE id = '${userId}'`)
  } catch (error) {
    return res.json({
      status: 'ERR', msg: error, query, commentsQuery: `UPDATE users SET commentsn = (commentsn - 1) WHERE id = '${userId}'`
    })
  }


  // Update place
  const placeQuery = `
    UPDATE places SET 
    rating = ((amount * rating - ${grade}) / (amount - 1)), 
    amount = (amount - 1), 
    WHERE id='${id}'
    `
  try {
    const result = await dbConn.query(placeQuery)
    if (result.affectedRows) return res.json({ status: 'OK', msg: 'Review deleted successfully' })
    throw 'nothing was deleted'
  } catch (error) {
    return res.json({ status: 'ERR', msg: error, query: placeQuery })
  }
})



router.post('/postFeedback', async (req, res) => {
  const { comment } = req.body
  const query = `INSERT INTO feedback (comment, date, ip) VALUES (?, ${Date.now()}, '${req.ip}')`
  try {
    await dbConn.query(query, [comment])
    return res.json({ status: 'OK' })
  } catch (error) {
    return res.json({ status: 'ERR', msg: error, query })
  }

})

module.exports = router