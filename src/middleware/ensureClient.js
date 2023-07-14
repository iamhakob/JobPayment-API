const ApiError = require('../apiError');

const ensureClient = async (req, res, next) => {
  if (req.profile.type !== 'client') {
    throw new ApiError(
      401,
      'Not authorized as client: non-clients not permitted for this action',
    );
  }

  next();
};

module.exports = { ensureClient };
