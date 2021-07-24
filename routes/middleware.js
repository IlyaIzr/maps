const middlewares = {}

middlewares.auth = function auth(req, res, next) {
  const userId = req.cookies['mp/auth']
  if (!userId) return res.json({ status: 'REAUTH' })

  req.userId = userId
  next();

};

module.exports = middlewares