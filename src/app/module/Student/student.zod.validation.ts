import { z } from 'zod';

// Enums for gender and blood group
const GenderEnum = z.enum(['male', 'female', 'other'], {
  errorMap: () => ({
    message:
      "The gender field can only be one of the following: 'male', 'female', 'other'.",
  }),
});

const BloodGroupEnum = z.enum(
  ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  {
    errorMap: () => ({
      message: 'Invalid blood group. Must be a valid blood group.',
    }),
  },
);

// Zod schema for UserName
const UserNameValidationSchema = z.object({
  firstName: z
    .string()
    .nonempty('First name is required')
    .max(20, 'First name must be less than 20 characters')
    .refine(
      (value) => value.charAt(0) === value.charAt(0).toUpperCase(),
      'First name must start with a capital letter',
    ),
  middleName: z.string().nonempty('Middle name is required'),
  lastName: z
    .string()
    .nonempty('Last name is required')
    .regex(/^[a-zA-Z]+$/, 'Last name must contain only letters'),
});
const UpdateUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .nonempty('First name is required')
    .max(20, 'First name must be less than 20 characters')
    .refine(
      (value) => value.charAt(0) === value.charAt(0).toUpperCase(),
      'First name must start with a capital letter',
    ).optional(),
  middleName: z.string().nonempty('Middle name is required').optional(),
  lastName: z
    .string()
    .nonempty('Last name is required')
    .regex(/^[a-zA-Z]+$/, 'Last name must contain only letters')
    .optional(),
});

// Zod schema for Guardian
const GuardianValidationSchema = z.object({
  fatherName: z.string().nonempty('Father name is required'),
  fatherOccupation: z.string().nonempty('Father occupation is required'),
  fatherContactNo: z.string().nonempty('Father contact number is required'),
  motherName: z.string().nonempty('Mother name is required'),
  motherOccupation: z.string().nonempty('Mother occupation is required'),
  motherContactNo: z.string().nonempty('Mother contact number is required'),
  address: z.string().nonempty('Address is required'),
});
const UpdateGuardianValidationSchema = z.object({
  fatherName: z.string().nonempty('Father name is required').optional(),
  fatherOccupation: z.string().nonempty('Father occupation is required').optional(),
  fatherContactNo: z.string().nonempty('Father contact number is required').optional(),
  motherName: z.string().nonempty('Mother name is required').optional(),
  motherOccupation: z.string().nonempty('Mother occupation is required').optional(),
  motherContactNo: z.string().nonempty('Mother contact number is required').optional(),
  address: z.string().nonempty('Address is required').optional(),
});

// Zod schema for LocalGuardian
const LocalGuardianValidationSchema = z.object({
  name: z.string().nonempty('Local guardian name is required'),
  contactNo: z.string().nonempty('Local guardian contact number is required'),
  address: z.string().nonempty('Local guardian address is required'),
  occupation: z.string().nonempty('Local guardian occupation is required'),
});
const UpdateLocalGuardianValidationSchema = z.object({
  name: z.string().nonempty('Local guardian name is required').optional(),
  contactNo: z.string().nonempty('Local guardian contact number is required').optional(),
  address: z.string().nonempty('Local guardian address is required').optional(),
  occupation: z.string().nonempty('Local guardian occupation is required').optional(),
});


// Main Student Schema
const StudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    student: z.object({
      name: UserNameValidationSchema,
      gender: GenderEnum,
      dateOfBirth: z.string(),
      email: z
        .string()
        .nonempty('Email is required')
        .email('Invalid email format'),
      contactNumber: z.string().nonempty('Contact number is required'),
      emergencyContactNo: z
        .string()
        .nonempty('Emergency contact number is required'),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().nonempty('Present address is required'),
      permanentAddress: z.string().nonempty('Permanent address is required'),
      guardian: GuardianValidationSchema,
      localGuardian: LocalGuardianValidationSchema,
      profileImg: z.string().url('Invalid URL format').optional(),
      admissionSemester: z.string(),
      academicDepartment: z.string(),
    }),
  }),
});

const UpdateStudentValidationSchema = z.object({
  body: z
    .object({
      student: z
        .object({
          name: UpdateUserNameValidationSchema.optional(),
          gender: GenderEnum.optional(),
          dateOfBirth: z.string().optional(),
          email: z
            .string()
            .nonempty('Email is required')
            .email('Invalid email format')
            .optional(),
          contactNumber: z
            .string()
            .nonempty('Contact number is required')
            .optional(),
          emergencyContactNo: z
            .string()
            .nonempty('Emergency contact number is required')
            .optional(),
          bloodGroup: z
            .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
            .optional(),
          presentAddress: z
            .string()
            .nonempty('Present address is required')
            .optional(),
          permanentAddress: z
            .string()
            .nonempty('Permanent address is required')
            .optional(),
          guardian: UpdateGuardianValidationSchema.optional(),
          localGuardian: UpdateLocalGuardianValidationSchema.optional(),
          admissionSemester: z.string().optional(),
          academicDepartment: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export const StudentValidationSchemas = {
  StudentValidationSchema,
  UpdateStudentValidationSchema,
};
