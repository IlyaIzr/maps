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
const { SQL_DUPLICATE_CODE, COMMENTS_PER_LEVEL } = require('../settings');



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
    if (!lat || !lng) return res.json({ status: 'ERR', msg: 'no lat or lng provided', query: placesQuery })
    iso_3166_2 = await fetchIsoCodeFromCoordinates(lat, lng)
  }
  let targetId = String(review.targetId)
  !targetId.endsWith(iso_3166_2) && (targetId += iso_3166_2);



  let anonId = ''
  if (userId === 'anonimus') {
    const ipAddress = proxyAddr(req, ['loopback', 'linklocal', 'uniquelocal']).slice(2);
    anonId = ipAddress.startsWith('ffff') ? ipAddress.slice(4) : ipAddress
    if (req.headers['user-agent']) {
      const { device } = deviceDetector.parse(req.headers['user-agent'])
      anonId += `${device?.type} ${device?.brand}`
    }
  }

  // Try to add a review
  const reviewQuery = `
  INSERT INTO reviews 
  (targetId, author, grade, comment, timestamp, anonId) 
  VALUES (?, ?, ?, ?, ${Date.now()}, ?)
  `

  try {
    await dbConn.query(reviewQuery, [targetId, userId, grade, comment, anonId || userId], true)
    // won't be adding new level if review query will return error. Including error for repeating comment
    var newLevel = await handleUserLevelUp();

  } catch (err) {
    if (err.code === SQL_DUPLICATE_CODE) {
      return res.json({ status: 'ERR', code: 'REPEATING_COMMENT' })
    }
    console.log(err)
    return res.json({ status: 'ERR', msg: err, query: reviewQuery })
  }

  try {
    var insertQuery = `
      INSERT INTO places
      ( id, rating, name, amount, x, y, lng, lat, polygon, iso_3166_2 ) 
      VALUES 
      ( '${targetId}', '${grade || 0}', ?, '${1}', '${x || 0}', '${y || 0}', '${lng || 0}', '${lat || 0}', ST_MPointFromText('${polyString}'), '${iso_3166_2}' )    

      ON DUPLICATE KEY UPDATE 
      rating = ((amount * rating + ${grade}) / (amount + 1)), 
      amount = (amount + 1)
    `;
    await dbConn.query(insertQuery, [name]);
    const { rating, amount } = await fetchNewRating(targetId);

    const placeToReturn = {
      x, y, lng, lat, name, id: targetId, rating, amount, iso_3166_2
    }

    res.json({ status: 'OK', msg: 'Review posted successfully', newLevel, place: placeToReturn })
  } catch (error) {
    console.log('%c⧭', 'color: #aa00ff', error);
    return res.json({ status: 'ERR', msg: JSON.stringify(error), query: { insertQuery } })
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

  async function handleUserLevelUp() {
    if (userId === 'anonimus' || typeof userLevel === 'undefined' || userLevel === 10) {
      return null;
    }

    const currentLevel = userLevel || 0;
    const nextLevel = currentLevel + 1;

    if (commentsNumber >= COMMENTS_PER_LEVEL[nextLevel - 1]) {
      const updateQuery = `UPDATE users SET level = ${nextLevel}, commentsn = ${notNaN(commentsNumber) + 1} WHERE id = '${userId}'`;
      await dbConn.query(updateQuery);
      return nextLevel;
    } else {
      const updateQuery = `UPDATE users SET commentsn = ${notNaN(commentsNumber) + 1} WHERE id = '${userId}'`;
      await dbConn.query(updateQuery);
    }
    return null;
  }
})


// @ /reviews/reviews
router.delete('/reviews', auth, async (req, res) => {
  const userId = req.userId
  const { timestamp, place: { id, grade, iso_3166_2 }, author, asRoot } = req.body

  if (!id || grade === undefined || !iso_3166_2 || asRoot === undefined) {
    return res.json({
      status: 'ERR', msg: 'Not enough data to delete', body: req.body
    })
  }

  if (asRoot) {
    const rootUsername = req.checkRoot?.()
    if (!rootUsername) return res.json({ status: 'ERR', msg: 'User is not root: ' + userId })
  } else {
    if (author !== userId) return res.json({ status: 'ERR', msg: `User ${userId} cannot delete comment of ${author}` })
  }


  // Delete review
  try {
    var deleteReviewQuery = `
    DELETE FROM reviews 
    WHERE targetId = '${id}' AND timestamp = '${timestamp}' AND grade = ${grade} AND author = ?
    `
    var deleteFromUserCountQuery = `UPDATE users SET commentsn = (commentsn - 1) WHERE id = ?`
    const result = await dbConn.query(deleteReviewQuery, author)
    if (!result.affectedRows) throw 'nothing was deleted'
    if (author !== 'anonimus') {
      await dbConn.query(deleteFromUserCountQuery, author)
    }
  } catch (error) {
    console.log(error)
    return res.json({
      status: 'ERR', msg: error, deleteReviewQuery, deleteFromUserCountQuery
    })
  }


  // Update place
  try {
    var placeQuery = `
      UPDATE places SET 
      rating = ((amount * rating - ${grade}) / (amount - 1)), 
      amount = (amount - 1)
      WHERE id='${id}'
    `
    const result = await dbConn.query(placeQuery)
    if (result.affectedRows) {
      const { rating, amount } = await fetchNewRating(id)
      res.json({ status: 'OK', msg: 'Review deleted successfully', updatedProps: { id, rating, amount } })
    }
    else throw 'nothing was deleted'
  } catch (error) {
    console.log(error)
    return res.json({ status: 'ERR', msg: error, query: placeQuery })
  }

  // Update city rating
  try {
    var citiesQuery = `
      INSERT INTO cities
      (code, rating, amount)  
      VALUES 
      ('${iso_3166_2}', ${grade}, ${1})
      ON DUPLICATE KEY UPDATE 
      rating = ((amount * rating - ${grade}) / (amount - 1)), 
      amount = (amount - 1)
    `
    await dbConn.query(citiesQuery)
  } catch (error) {
    console.log(error)
    return res.json({ status: 'ERR', msg: error, query: citiesQuery })
  }
})

async function fetchNewRating(id) {
  const newRatingQuery = `SELECT rating, amount FROM places WHERE id = '${id}'`
  try {
    const ratingResponse = await dbConn.query(newRatingQuery)
    const { rating, amount } = ratingResponse?.[0]
    return { rating: Number(rating), amount }
  } catch (error) {
    return error
  }
}

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