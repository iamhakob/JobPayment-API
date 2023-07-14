const Joi = require('joi');
const ApiError = require('../apiError');

const DEFAULT_CLIENT_LIMIT = 2;

const bestProfessionSchema = Joi.object({
  start: Joi.date().iso().required(),
  end: Joi.date().iso().required(),
});

const bestClientsSchema = Joi.object({
  start: Joi.date().iso().required(),
  end: Joi.date().iso().required(),
  limit: Joi.number().integer().default(DEFAULT_CLIENT_LIMIT),
});

const validateBestProfessionInput = async (req, res, next) => {
  const { error, value } = bestProfessionSchema.validate(req.query);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { start, end } = value;

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (endDate.getTime() < startDate.getTime()) {
    throw new ApiError(
      400,
      'Invalid params: end date can\'t be sooner than the start date',
    );
  }

  next();
};

const validateBestClientsInput = async (req, res, next) => {
  const { error, value } = bestClientsSchema.validate(req.query);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { start, end, limit } = value;

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (endDate.getTime() < startDate.getTime()) {
    throw new ApiError(
      400,
      'Invalid params: end date can\'t be sooner than the start date',
    );
  }

  // for default value
  req.query.limit = limit;

  next();
};

module.exports = { validateBestProfessionInput, validateBestClientsInput };
