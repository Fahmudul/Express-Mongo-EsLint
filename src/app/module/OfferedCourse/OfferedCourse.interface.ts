import { Types } from 'mongoose';

export type TDays = 'Sat' | 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

export type TOfferedCourse = {
  semesterRegistration: Types.ObjectId;
  academicSemester?: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  course: Types.ObjectId;
  faculty: Types.ObjectId;
  days: TDays[];
  startTime: string;
  maxCapacity: number;
  section: number;
  endTime: string;
};
export type TSchedule = {
  days: TDays[];
  startTime: string;
  endTime: string;
};
