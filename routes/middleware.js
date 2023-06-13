const { authCookieName } = require("../settings");
const { getRootUsername, clearUserCookie } = require("./helpres");

const middlewares = {}

middlewares.auth = function auth(req, res, next) {
  const userId = req.cookies[authCookieName]
  if (!userId) return clearUserCookie(res)

  req.userId = userId
  req.checkRoot = getRootUsername.bind(this, userId)
  next();

};

module.exports = middlewares