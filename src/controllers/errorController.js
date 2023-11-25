import { ErrorValidator } from "../validators/Errorvalidators.js";

const errorController = (error, req, res, next) => {
  const validator = new ErrorValidator(res, error);
  next;
  if (error.name === "ZodError") {
    return validator.zodValidator();
  }
  if (error.isOperational) {
    return validator.customValidator();
  }
  if (error.code === 11000) {
    return validator.mongoUniqueValidator();
  }
  if (error.name === "CastError") {
    return validator.mongoCastValidator();
  }
  if (error.name === "PayloadTooLargeError") {
    return validator.largePayload();
  } else {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default errorController;
