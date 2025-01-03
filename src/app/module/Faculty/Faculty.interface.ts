import { Date, Model, Types } from 'mongoose';
import { UserName } from '../Student/student.interface';
export type TGender = 'male' | 'female' | 'other';
export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';
export type TFaculty = {
  id: string;
  user: Types.ObjectId;
  designation: string;
  name: UserName;
  gender: TGender;
  dateOfBirth: Date;
  email: string;
  contactNo: string;
  bloodGroup?: TBloodGroup;
  emergencyContactNo: string;
  presentAddress: string;
  permanentAddress: string;
  profileImage: string;
  academicDepartment: Types.ObjectId;
  isDeleted: boolean;
};

export interface FacultyStaticsModel extends Model<TFaculty> {
  isUserExist(id: string): Promise<TFaculty | null>;
}
