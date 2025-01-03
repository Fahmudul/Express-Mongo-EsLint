import { z } from 'zod';

const UserNameSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('Last name is required'),
  middleName: z.string().optional(), // Optional field
});

export const FacultySchema = z.object({
  body: z.object({
    faculty: z.object({
      designation: z.string().nonempty('Designation is required'),
      name: UserNameSchema,
      gender: z.enum(['male', 'female', 'other'], {
        required_error: 'Gender is required',
      }),
      dateOfBirth: z.string({ required_error: 'Date of birth is required' }),
      email: z.string().email('Invalid email address'),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      presentAddress: z.string().nonempty('Present address is required'),
      permanentAddress: z.string().nonempty('Permanent address is required'),
      profileImage: z.string().url('Profile image must be a valid URL'),
      academicDepartment: z
        .string()
        .nonempty('Academic department ID is required'), // Assuming it's stored as a string ID
    }),
  }),
});
