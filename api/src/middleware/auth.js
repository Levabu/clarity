const jwt = require('../lib/jwt');
const UsersDAO = require('../dao/usersDAO');

const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      req.user = null;
      return next();
    }
    try {
        const decodedValue = jwt.verify(authorization.slice(7));
        const user = await UsersDAO.getUserById(decodedValue._id);
        if (user && !user.error) {
          req.user = decodedValue;
        }
        return next();
    } catch(error) {
      return res.status(401).send('User is not authorized to access this endpoint')
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
}

module.exports = {
  auth,
};