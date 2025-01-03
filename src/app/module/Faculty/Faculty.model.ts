import { Schema, model, models } from 'mongoose';
import { FacultyStaticsModel, TFaculty } from './Faculty.interface';
import { UserSchema } from '../Student/student.model';
import { Gender } from './Faculty.constants';
const FacultySchema = new Schema<TFaculty>(
  {
    id: { type: String, required: [true, 'ID is required'] },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    designation: { type: String, required: true },
    name: UserSchema,
    gender: {
      type: String,
      enum: {
        values: Gender,
        message: '{VALUE} is not a valid gender',
      },
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    email: { type: String, required: [true, 'Email is required'] },
    contactNo: { type: String, required: [true, 'Contact number is required'] },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    profileImage: {
      type: String,
      required: [true, 'Profile image is required'],
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic department is required'],
      ref: 'AcademicDepartMent',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);
FacultySchema.virtual('fullName').get(function () {
  return (
    this?.name?.firstName +
    ' ' +
    this?.name?.middleName +
    ' ' +
    this?.name?.lastName
  );
});

FacultySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

FacultySchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

FacultySchema.statics.isUserExists = async function (id: string) {
  const existingUser = await FacultyModel.findOne({ id });
  return existingUser;
};

const FacultyModel =
  models.FacultyModel ||
  model<TFaculty, FacultyStaticsModel>('FacultyModel', FacultySchema);
export default FacultyModel;
