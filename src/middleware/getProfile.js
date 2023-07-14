const ApiError = require('../apiError');

const getProfile = async (req, res, next) => {
  const { Profile } = req.app.get('models');

  const profile = await Profile.findOne({
    where: { id: req.get('profile_id') || 0 },
  });

  if (!profile) {
    throw new ApiError(401, 'Not authorized');
  }

  req.profile = profile;

  next();
};

module.exports = { getProfile };
