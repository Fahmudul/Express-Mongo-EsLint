import { z } from 'zod';

const userValidationSchema = z.object({ 
  password: z
    .string({
      invalid_type_error: 'Password must be a string',
    })
    .max(50, 'Password must be less than 20 characters')
    .optional(),
});
export const UserValidation = { userValidationSchema };
