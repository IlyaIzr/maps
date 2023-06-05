const { getRootUsername } = require("./helpres");

const middlewares = {}

middlewares.auth = function auth(req, res, next) {
  const userId = req.cookies['mp/auth']
  if (!userId) return res.json({ status: 'REAUTH' })

  req.userId = userId
  req.checkRoot = getRootUsername.bind(this, userId)
  next();

};

module.exports = middlewares