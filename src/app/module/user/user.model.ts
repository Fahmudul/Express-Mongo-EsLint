import { Schema, model, models } from 'mongoose';
import { Tuser, UserModel } from './user.interface';
export const userSchema = new Schema<Tuser, UserModel>(
  {
    id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['admin', 'faculty', 'student'],
    },
    passwordChangeAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.static('isUserExistsByCustomId', async function (id: string) {
  return await User.findOne({ id });
});

userSchema.static(
  'isPasswordMatched',
  async function (givenPassword: string, savedPassword: string) {
    return givenPassword === savedPassword;
  },
);
export const User = model<Tuser, UserModel>('User', userSchema);
