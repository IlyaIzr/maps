const express = require('express');
const router = express.Router()
const Connection = require('../db/connection')
const dbConn = new Connection()
const proxyAddr = require('proxy-addr');
const DeviceDetector = require("device-detector-js");
const deviceDetector = new DeviceDetector();
// rest
const { auth } = require('./middleware');
const { fetchIsoCodeFromCoordinates, getCityInfo, fetchCityData } = require('./cities');
const { SQL_DUPLICATE_CODE } = require('../settings');



// @ api/reviews/reviews

router.get('/reviews', async (req, res) => {
  const { targetId } = req.query
  if (!targetId) return res.json({ status: 'OK', data: [] })

  try {
    const query = `
    SELECT reviews.*, users.name, users.login FROM reviews
    LEFT JOIN users ON reviews.author = users.id
    WHERE reviews.targetId = '${targetId}'
    ORDER BY LENGTH(comment) DESC, timestamp DESC `
    const data = await dbConn.query(query)
    //TODO // LIMIT 10 OFFSET 10 
    return res.json({ status: 'OK', data })
  } catch (err) {
    console.log(err)
    return res.json({ status: 'ERR', msg: err, err })
  }
})



// @ api/reviews/postReview


router.post('/postReview', async (req, res) => {
  const { userId, userLevel, commentsNumber, review, place } = req.body
  const { grade, comment } = review
  const { x, y, lng, lat, polyString, name } = place
  let { iso_3166_2 } = place
  if (!iso_3166_2) {
    // TODO the case when resubmitting same place
    if (!lat || !lng) return res.json({ status: 'ERR', msg: 'no lat or lng provided', query: placesQuery })
    iso_3166_2 = await fetchIsoCodeFromCoordinates(lat, lng)
  }

  let targetId = review.targetId + (iso_3166_2 || '')

  // upsert place rating and polygon into db
  const placesQuery = `
  INSERT INTO places
  ( id, rating, name, amount, x, y, lng, lat, polygon, iso_3166_2 ) 
  VALUES 
  ( '${targetId}', '${grade || 0}', ?, '${1}', '${x || 0}', '${y || 0}', '${lng || 0}', '${lat || 0}', ST_MPointFromText('${polyString}'), '${iso_3166_2}' )
  ON DUPLICATE KEY UPDATE 
  rating = ((amount * rating + ${grade}) / (amount + 1)), 
  amount = (amount + 1), 
  polygon = ST_MPointFromText('${polyString}')
  `

  try {
    await dbConn.query(placesQuery, name)
  } catch (err) {
    console.log(err)
    return res.json({ status: 'ERR', msg: err, query: placesQuery })
  }

  let anonId = ''
  if (userId === 'anonimus') {
    const ipAddress = proxyAddr(req, ['loopback', 'linklocal', 'uniquelocal']).slice(2);
    anonId = ipAddress.startsWith('ffff') ? ipAddress.slice(4) : ipAddress
    if (req.headers['user-agent']) {
      const { device } = deviceDetector.parse(req.headers['user-agent'])
      anonId += `${device?.type} ${device?.brand}`
    }
  }


  const reviewQuery = `
  INSERT INTO reviews 
  (targetId, author, grade, comment, timestamp, anonId) 
  VALUES (?, ?, ?, ?, ${Date.now()}, ?)
  `

  let newLevel = null
  try {
    await dbConn.query(reviewQuery, [targetId, userId, grade, comment, anonId || userId])

    await (async function levelUp() {
      if (userId === 'anonimus' || typeof userLevel === 'undefined' || userLevel === 10) return;

      let commentStep = 2 + (4 * 10)  //amount of comments for level 10
      for (let i = 10; i > 0; i--) {
        if (commentsNumber + 1 >= commentStep) {
          if (i === userLevel) break;
          await dbConn.query(`UPDATE users SET level = ${i}, commentsn = ${notNaN(commentsNumber) + 1} WHERE id = '${userId}'`)
          newLevel = i
          break;
        }
        commentStep = 2 + (4 * (i - 1))
      }
    })()
    if (!newLevel && userId !== 'anonimus')
      await dbConn.query(`UPDATE users SET commentsn = ${notNaN(commentsNumber) + 1} WHERE id = '${userId}'`)

    res.json({ status: 'OK', msg: 'Review posted successfully', newLevel })
  } catch (err) {
    if (err.code === SQL_DUPLICATE_CODE) {
      return res.json({ status: 'ERR', code: 'REPEATING_COMMENT' })
    }
    console.log(err)
    return res.json({ status: 'ERR', msg: err, query: reviewQuery })
  }



  // Update city rating or add info about new city
  try {
    const cityInfo = await getCityInfo(iso_3166_2, ['geometry'])
    var citiesQuery = ''
    if (cityInfo) {
      citiesQuery = `
        INSERT INTO cities
        (code, rating, amount)  
        VALUES 
        ('${iso_3166_2}', ${grade}, ${1})
        ON DUPLICATE KEY UPDATE 
        rating = ((amount * rating + ${grade}) / (amount + 1)), 
        amount = (amount + 1)
    `} else {
      const { en, ru, polyString } = await fetchCityData(iso_3166_2, lat, lng)
      citiesQuery = `      
        INSERT INTO cities
        (code, rating, amount, lat, lng, en, ru, geometry)  
        VALUES 
        ('${iso_3166_2}', ${grade}, ${1}, ${lat}, ${lng}, '${en}', '${ru}', ST_MPointFromText('${polyString}'))
      `
    }
    await dbConn.query(citiesQuery)
  } catch (error) {
    return console.log('%c⧭', 'color: #00736b', 'error while getting city data', iso_3166_2, citiesQuery);
  }
})



// @ /reviews/reviews

router.delete('/reviews', auth, async (req, res) => {

  const userId = req.userId
  const { timestamp, place: { id, grade, iso_3166_2 } } = req.body
  // Delete review

  const query = `DELETE FROM reviews WHERE author = '${userId}' AND timestamp = '${timestamp}'`
  try {
    const result = await dbConn.query(query)
    if (!result.affectedRows) throw 'nothing was deleted'
    if (userId !== 'anonimus')
      await dbConn.query(`UPDATE users SET commentsn = (commentsn - 1) WHERE id = '${userId}'`)
  } catch (error) {
    console.log(error)
    return res.json({
      status: 'ERR', msg: error, query, commentsQuery: `UPDATE users SET commentsn = (commentsn - 1) WHERE id = '${userId}'`
    })
  }


  // Update place
  const placeQuery = `
    UPDATE places SET 
    rating = ((amount * rating - ${grade}) / (amount - 1)), 
    amount = (amount - 1)
    WHERE id='${id}'
    `
  try {
    const result = await dbConn.query(placeQuery)
    if (result.affectedRows) res.json({ status: 'OK', msg: 'Review deleted successfully' })
    else throw 'nothing was deleted'
  } catch (error) {
    console.log(error)
    return res.json({ status: 'ERR', msg: error, query: placeQuery })
  }

  // Update city rating
  citiesQuery = `
    INSERT INTO cities
    (code, rating, amount)  
    VALUES 
    ('${iso_3166_2}', ${grade}, ${1})
    ON DUPLICATE KEY UPDATE 
    rating = ((amount * rating - ${grade}) / (amount - 1)), 
    amount = (amount - 1)
  `
  try {
    await dbConn.query(citiesQuery)
  } catch (error) {
    console.log(error)
    return res.json({ status: 'ERR', msg: error, query: citiesQuery })
  }
})

// @ /reviews/delteAsRoot
router.delete('/delteAsRoot', auth, async (req, res) => {
  const userId = req.userId
  const rootUsername = req.checkRoot?.()
  if (!rootUsername) return res.json({ status: 'ERR', msg: 'User is not root: ' + userId })
  const { timestamp, place: { id, grade, iso_3166_2 }, author } = req.body
  // Delete review

  const deleteReviewQuery = `
    DELETE FROM reviews 
    WHERE targetId = '${id}' AND timestamp = '${timestamp}' AND grade = ${grade} AND author = ?
  `
  const deleteFromUserCountQuery = `UPDATE users SET commentsn = (commentsn - 1) WHERE id = ?`
  try {
    const result = await dbConn.query(deleteReviewQuery, author)
    if (!result.affectedRows) throw 'nothing was deleted'
    if (author !== 'anonimus')
      await dbConn.query(deleteFromUserCountQuery, author)
  } catch (error) {
    console.log(error)
    return res.json({
      status: 'ERR', msg: error, deleteReviewQuery, deleteFromUserCountQuery
    })
  }


  // Update place
  const placeQuery = `
    UPDATE places SET 
    rating = ((amount * rating - ${grade}) / (amount - 1)), 
    amount = (amount - 1)
    WHERE id='${id}'
    `
  try {
    const result = await dbConn.query(placeQuery)
    if (result.affectedRows) res.json({ status: 'OK', msg: 'Review deleted successfully' })
    else throw 'nothing was deleted'
  } catch (error) {
    console.log(error)
    return res.json({ status: 'ERR', msg: error, query: placeQuery })
  }

  // Update city rating
  citiesQuery = `
    INSERT INTO cities
    (code, rating, amount)  
    VALUES 
    ('${iso_3166_2}', ${grade}, ${1})
    ON DUPLICATE KEY UPDATE 
    rating = ((amount * rating - ${grade}) / (amount - 1)), 
    amount = (amount - 1)
  `
  try {
    await dbConn.query(citiesQuery)
  } catch (error) {
    console.log(error)
    return res.json({ status: 'ERR', msg: error, query: citiesQuery })
  }
})



router.post('/postFeedback', async (req, res) => {
  const { comment } = req.body
  const query = `INSERT INTO feedback (comment, date, ip) VALUES (?, ${Date.now()}, '${req.ip}')`
  try {
    await dbConn.query(query, [comment])
    return res.json({ status: 'OK' })
  } catch (error) {
    console.log(error)
    return res.json({ status: 'ERR', msg: error, query })
  }

})

// change table to have id
function notNaN(val) {
  if (!val && typeof val === 'number' && val !== 0) return 0
  return val
}

module.exports = router