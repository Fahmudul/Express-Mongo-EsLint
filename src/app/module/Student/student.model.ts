import mongoose from 'mongoose';
import {
  Gurdian,
  Student,
  UserName,
  LocalGurdian,
  StudentModel,
} from './student.interface';
import validator from 'validator';
import { Schema } from 'mongoose';
// User schema
export const UserSchema = new mongoose.Schema<UserName>({
  firstName: {
    type: String,
    // creating custom messages ==> required:[true, 'your custom message']
    required: [true, 'First name is required'],
    maxlength: [20, 'First name must be less than 20 characters'],
    validate: {
      validator: function (value) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      message: '{VALUE} is not in capitalize format',
    },
  },
  middleName: {
    type: String,
    required: [true, 'second name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'last name is required'],
    validate: {
      validator: function (value: string) {
        return validator.isAlpha(value);
      },
      message: '{VALUE} is not in valid',
    },
  },
});

// Gurdian Schema
const GurdianSchma = new mongoose.Schema<Gurdian>({
  fatherName: { type: String, required: true },
  fatherOccupation: { type: String, required: true },
  fatherContactNo: { type: String, required: true },
  motherName: { type: String, required: true },
  motherOccupation: { type: String, required: true },
  motherContactNo: { type: String, required: true },
  address: { type: String, required: true },
});

// Local Gurdian Schema
const LocalGurdianSchma = new mongoose.Schema<LocalGurdian>({
  name: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
  occupation: { type: String, required: true },
});
const StudentSchema = new mongoose.Schema<Student, StudentModel>({
  id: { type: String },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
    unique: true,
    ref: 'User',
  },

  name: UserSchema,
  gender: {
    type: String,
    // enum: ['male', 'female', 'other'],
    // Custom message in enum
    enum: {
      values: ['male', 'female', 'other'],
      message:
        "The gender field can only be one of the following 'male', 'female', 'other'.",
    },
    required: true,
  },
  dateOfBirth: { type: Date },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  emergencyContactNo: { type: String, required: true },
  presentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  guardian: GurdianSchma,
  localGuardian: LocalGurdianSchma,
  profileImg: { type: String },
  admissionSemester: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicSemester',
  },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicDepartMent',
  },
  isDeleted: { type: Boolean, default: false },
});
// creating custom instance method
// StudentSchema.methods.isUserExist = async function (id: string) {
//   const existingUser = await Students.findOne({ id });
//   return existingUser;
// };

// ! ****************************

// * middleware (document) that works before saving
// StudentSchema.pre('save', function () {
//   // will work on save()
//   // create() method
//   console.log('pre middleware');
// });

// Query middleware
StudentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Query middleware
StudentSchema.pre('findOne', function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

// find single using aggregation middleware
StudentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});
// post save middleware / hook
StudentSchema.post('save', function () {
  console.log('post middleware');
});

// Virtual

// creating custom static method
StudentSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await Students.findOne({ id });
  return existingUser;
};

// Creating model
const Students =
  mongoose.models.Students ||
  mongoose.model<Student, StudentModel>('Students', StudentSchema);
export default Students;
