import { Model } from 'mongoose';
import { USER_ROLES } from './user.constant';

export interface Tuser {
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'admin' | 'faculty' | 'student';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
  passwordChangeAt?: Date;
}

export interface UserModel extends Model<Tuser> {
  // eslint-disable-next-line no-unused-vars
  isUserExistsByCustomId(id: string): Promise<Tuser | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLES;
