import Joi from 'joi';

// creating Joi based schema validation
const UserNameValidationSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .max(20)
    .regex(/^[A-Z][a-zA-Z]*$/)
    .message(
      'First name must start with a capital letter and contain only letters',
    ),
  middleName: Joi.string().required().messages({
    'any.required': 'Middle name is required',
  }),
  lastName: Joi.string()
    .required()
    .regex(/^[a-zA-Z]+$/)
    .message('Last name must contain only letters'),
});

const GurdianValidationSchema = Joi.object({
  fatherName: Joi.string().required(),
  fatherOccupation: Joi.string().required(),
  fatherContactNo: Joi.string().required(),
  motherName: Joi.string().required(),
  motherOccupation: Joi.string().required(),
  motherContactNo: Joi.string().required(),
  address: Joi.string().required(),
});

const LocalGurdianValidationSchema = Joi.object({
  name: Joi.string().required(),
  contactNo: Joi.string().required(),
  address: Joi.string().required(),
  occupation: Joi.string().required(),
});

const StudentValidationSchema = Joi.object({
  id: Joi.string().optional(),
  name: UserNameValidationSchema.required(),
  gender: Joi.string().valid('male', 'female', 'other').required().messages({
    'any.only':
      "The gender field can only be one of the following: 'male', 'female', 'other'.",
  }),
  dateOfBirth: Joi.string().optional(),
  email: Joi.string().email().required(),
  contactNumber: Joi.string().required(),
  emergencyContactNo: Joi.string().required(),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .optional(),
  presentAddress: Joi.string().required(),
  permanentAddress: Joi.string().required(),
  guardian: GurdianValidationSchema.required(),
  localGuardian: LocalGurdianValidationSchema.required(),
  profileImg: Joi.string().uri().optional(),
  isActive: Joi.string().valid('active', 'blocked').default('active'),
});

export default StudentValidationSchema;
