const HttpError = require("../utils/HttpError");

const handleDuplicateKeyError = (err) => {
  const [key, value] = Object.entries(err.keyValue)[0];
  const message = `${key}重复，${value}已经存在`;
  return new HttpError(message, 400);
};

const handleValidationError = (err) => {
  const messageList = [];
  for (const key in err.errors) {
    messageList.push(err.errors[key].message);
  }
  const message = messageList.join("\n");
  return new HttpError(message, 400);
};

const handleCastError = (err) => {
  const message = `${err.path}不合法`;
  return new HttpError(message, 400);
};

module.exports = (err, _, res, __) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    console.log("dev");
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === "production") {
    if (err.code === 11000) {
      err = handleDuplicateKeyError(err);
    } else if (err.name === "ValidationError") {
      err = handleValidationError(err);
    } else if (err.name === "CastError") {
      err = handleCastError(err);
    }
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};
