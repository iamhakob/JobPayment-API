const Joi = require('joi');
const ApiError = require('../apiError');

const contractSchema = Joi.number().integer().required();

const validateContractInput = async (req, res, next) => {
  const { error } = await contractSchema.validate(req.params.id);

  if (error) {
    throw new ApiError(400, 'Invalid id');
  }

  next();
};

module.exports = {
  validateContractInput,
};
