const authService = require('../api/auth/auth.service');
const asyncLocalStorage = require('../services/als.service');

async function setupAsyncLocalStorage(req, res, next) {
  const storage = {};
  // console.log('req:', req);
  asyncLocalStorage.run(storage, () => {
    if (!req.cookies) return next();
    console.log('req.cookies.loggedinUser:', req.cookies.loggedinUser);
    const loggedinUser = authService.validateToken(req.cookies.loggedinUser);

    if (loggedinUser) {
      const alsStore = asyncLocalStorage.getStore();
      alsStore.loggedinUser = loggedinUser;
    }
    next();
  });
}

module.exports = setupAsyncLocalStorage;
