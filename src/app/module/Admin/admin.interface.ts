import { UserName } from '../Student/student.interface';
import { TBloodGroup } from './../Faculty/Faculty.interface';
import { Model, Types } from 'mongoose';
export type TGender = 'male' | 'female' | 'other';
export type TUsername = UserName;
export type TAdmin = {
  id: string;
  user: Types.ObjectId;
  designation: string;
  name: TUsername;
  gender: TGender;
  dateOfBirth: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  presentAddress: string;
  permanentAddress: string;
  profileImage?: string;
  academicDepartment: Types.ObjectId;
  isDeleted: boolean;
  bloodGroup?: TBloodGroup;
};

export interface AdminModel extends Model<TAdmin> {
  isUserExist(id: string): Promise<TAdmin | null>;
}
