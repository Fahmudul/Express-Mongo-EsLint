/* eslint-disable no-unused-vars */
import { Date, Model, Types } from 'mongoose';

export enum BloodGroup {
  A_PLUS = 'A+',
  A_MINUS = 'A-',
  B_PLUS = 'B+',
  B_MINUS = 'B-',
  AB_PLUS = 'AB+',
  AB_MINUS = 'AB-',
  O_PLUS = 'O+',
  O_MINUS = 'O-',
}
// Gurdian type
export type Gurdian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
  address: string;
};

export type UserName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export type LocalGurdian = {
  name: string;
  contactNo: string;
  address: string;
  occupation: string;
};

export interface Student {
  id: string;
  user: Types.ObjectId;
  name: UserName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: Date;
  email: string;
  contactNumber: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  emergencyContactNo: string;
  guardian: Gurdian;
  localGuardian: LocalGurdian;
  profileImg?: string;
  admissionSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  isDeleted: boolean;
}
//! * for creating instance method
// export type StudentMethod = {
//   isUserExist(id: string): Promise<Student | null>;
// };

//! * for creating static method

export interface StudentModel extends Model<Student> {
  isUserExist(id: string): Promise<Student | null>;
}

// export type StudentModel = Model<Student, Record<string, never>, StudentMethod>;
