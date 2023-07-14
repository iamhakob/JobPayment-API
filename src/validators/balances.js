const Joi = require('joi');
const ApiError = require('../apiError');

const depositSchema = Joi.object({
  userId: Joi.number().integer().required(),
  deposit: Joi.number().positive().required(),
});

const validateDepositInput = async (req, res, next) => {
  const { error } = await depositSchema.validate({
    userId: req.params.userId,
    deposit: req.body.deposit,
  });

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  next();
};

module.exports = {
  validateDepositInput,
};