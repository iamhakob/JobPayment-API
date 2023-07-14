class ApiError extends Error {
  constructor(code = 500, message = 'Something went wrong') {
    super(message);
    this.code = code;
  }
}

module.exports = ApiError;
