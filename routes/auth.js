// boiler
const express = require('express');
const router = express.Router()
const Connection = require('../db/connection')
const dbConn = new Connection()
// rest
const crypto = require('crypto');


const some = crypto.randomUUID().replaceAll('-', '')


// @ api/maps/reviews

router.post('/login', async (req, res) => {
  const { login, pword } = req.query
  if (!login || !pword) return res.json({ status: 'ERR', data: [] })

  try {
    // check
  } catch (err) {
    return res.json({ status: 'ERR', msg: err, err })
  }
})


module.exports = router