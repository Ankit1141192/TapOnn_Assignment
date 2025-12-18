const { auth } = require('../services/firebase.js');
const { UnauthorizedError } = require('../utils/errors.js');

const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) throw new UnauthorizedError('No authorization token provided');

    const decodedToken = await auth.verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

module.exports = requireAuth;
