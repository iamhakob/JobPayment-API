const Joi = require('joi');
const ApiError = require('../apiError');

const payJobSchema = Joi.number().integer().required();

const validatePaymentInput = async (req, res, next) => {
  const { error } = await payJobSchema.validate(req.params.job_id);

  if (error) {
    throw new ApiError(400, 'Invalid job_id');
  }

  next();
};

module.exports = {
  validatePaymentInput,
};
