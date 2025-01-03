import { ZodError, ZodIssue } from 'zod';
import { TGenericErrorResponse } from './ErrorTypes';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const statusCode = 400;
  const errorSource = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });
  return {
    statusCode,
    message: 'Zod Validation Error',
    errorSource,
  };
};

export default handleZodError;
