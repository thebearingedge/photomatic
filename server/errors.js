class ClientError {
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}

function errorHandler(err, req, res, next) {
  if (err instanceof ClientError) {
    return res.status(err.status).json({
      error: err.message
    });
  }
  console.error(err);
  res.status(500).json({
    error: 'An unexpected error occured.'
  });
}

exports.ClientError = ClientError;

exports.errorHandler = errorHandler;
