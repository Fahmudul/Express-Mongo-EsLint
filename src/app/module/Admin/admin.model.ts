import { Schema, model } from 'mongoose';
import { BloodGroup, Gender } from './admin.constant';
import { AdminModel, TAdmin, TUsername } from './admin.interface';

const userNameSchema = new Schema<TUsername>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [20, 'First name must be less than 20 characters'],
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [20, 'Last name must be less than 20 characters'],
  },
});

const AdminSchema = new Schema<TAdmin>(
  {
    id: {
      type: String,
      required: [true, 'Admin ID is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      unique: true,
      ref: 'User',
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
    },
    name: userNameSchema,
    gender: {
      type: String,
      enum: Gender,
    },
    dateOfBirth: {
      type: Date,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNo: {
      type: String,
      required: [true, 'Contact number is required'],
      unique: true,
    },
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
    },
    bloodGroup: {
      type: String,
      enum: BloodGroup,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

AdminSchema.virtual('fullName').get(function () {
  return (
    this?.name?.firstName +
    ' ' +
    this?.name?.middleName +
    ' ' +
    this?.name?.lastName
  );
});

// Filter out deleted documents
AdminSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

AdminSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

AdminSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

AdminSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await Admin.findOne({ id: id });
  return existingUser;
};

const Admin = model<TAdmin, AdminModel>('Admin', AdminSchema);
export default Admin;
