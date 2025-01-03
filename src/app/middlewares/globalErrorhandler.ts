import { ErrorRequestHandler } from 'express';
import { ZodError, ZodIssue } from 'zod';
import config from '../config';
import handleZodError from '../errors/handleZodError';
import TErrorSource from '../errors/ErrorTypes';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  next,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let errorSources: TErrorSource = [
    { path: '', message: 'Something went wrong' },
  ];

  if (err instanceof ZodError) {
    // convert zod error to a custom error
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }
  console.log(err);
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV !== 'production' ? err.stack : null,
  });
};

export default globalErrorHandler;
