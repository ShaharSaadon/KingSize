const authService = require('../api/auth/auth.service');
const logger = require('../services/logger.service');
const config = require('../config');
const asyncLocalStorage = require('../services/als.service');

function requireAuth(req, res, next) {
  const { loggedinUser } = asyncLocalStorage.getStore();
  // logger.debug('MIDDLEWARE', loggedinUser)

  if (!loggedinUser) return res.status(401).send('Not Authenticated');
  next();
}

// function requireAuth(req, res, next) {
//   // Check if token exists in the authorization header
//   const token = req.headers.authorization;
//   if (token) {
//     // Use your method of verifying the token
//     const user = verifyToken(token);
//     if (!user) {
//       return res.status(401).send('Not Authenticated');
//     }
//     next();
//   } else {
//     const { loggedinUser } = asyncLocalStorage.getStore();
//     if (!loggedinUser) return res.status(401).send('Not Authenticated');
//     next();
//   }
// }

function requireAdmin(req, res, next) {
  const { loggedinUser } = asyncLocalStorage.getStore();
  if (!loggedinUser) return res.status(401).send('Not Authenticated');
  if (!loggedinUser.isAdmin) {
    logger.warn(loggedinUser.fullname + 'attempted to perform admin action');
    res.status(403).end('Not Authorized');
    return;
  }
  next();
}

// module.exports = requireAuth

module.exports = {
  requireAuth,
  requireAdmin,
};
