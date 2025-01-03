import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../AcademicSemester/AcedemicSemester.model';
import { Student } from '../Student/student.interface';
import Students from '../Student/student.model';
import { Tuser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentID,
} from './user.utils';
import { TFaculty } from '../Faculty/Faculty.interface';
import { AcademicDepartMent } from '../AcademicDepartment/AcademicDepartment.model';
import FacultyModel from '../Faculty/Faculty.model';
import { TAdmin } from '../Admin/admin.interface';
import Admin from '../Admin/admin.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createStudentIntoDB = async (
  file: any,
  payload: Student,
  password: string,
) => {
  //* checking a student already exist (using static method)
  // if (await (Students as StudentModel).isUserExist(studentData.id)) {
  //   throw new Error('Student alreadyy exist');
  // }
  const userData: Partial<Tuser> = {};
  userData.password = password || (config.defaultPass as string);
  // set student role
  userData.role = 'student';
  userData.email = payload.email;
  // userData.id = '2030100001';
  // step 1. Create a user according to the ER diagram. From here we will get two ids.
  // _id, id(auto generated). in the student collection we will embed the id and reference with _id
  const admissionSemester = await AcademicSemester.findOne({
    _id: payload.admissionSemester,
  });
  //* Using transaction and rollback from mongoose. Here we are using transaction because at a time we are operating on two different collection in our database.
  // Step - 1. Start session
  const session = await mongoose.startSession();

  try {
    // Step - 2. Start transaction
    session.startTransaction();
    // Set generated id
    userData.id = await generateStudentID(admissionSemester);
    const imageName = `student_${userData.id}`;
    const path = file?.path;
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new Error('Failed to create user');
    } else {
      payload.id = newUser[0].id; // embeded id
      payload.user = newUser[0]._id; // reference the _id from user collection
      payload.profileImg = secure_url;

      // Create a student according to the ER diagram.
      const newStudent = await Students.create([payload], { session });
      // step 3 commit the transaction
      await session.commitTransaction();
      await session.endSession();
      return newStudent;
    }
    // set _id, id
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};
const createFacultyIntoDB = async (
  password: string,
  payload: Partial<TFaculty>,
) => {
  const userData: Partial<Tuser> = {};
  userData.password = password || (config.defaultPass as string);
  userData.role = 'faculty';
  userData.email = payload.email;
  const academicDepartment = await AcademicDepartMent.findById(
    payload.academicDepartment,
  );
  if (!academicDepartment) {
    throw new Error('Academic department does not exist');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await generateFacultyId();
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new Error('Failed to create user');
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference id
    const newFaculty = await FacultyModel.create([payload], { session });
    if (!newFaculty.length) {
      throw new Error('Failed to create faculty');
    }
    await session.commitTransaction();
    await session.endSession();
    return newFaculty;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    console.log(error);
    throw error;
  }
};

const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  const userData: Partial<Tuser> = {};
  userData.password = password || (config.defaultPass as string);
  userData.role = 'admin';
  userData.email = payload.email;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await generateAdminId();
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new Error('Failed to create user');
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference if
    const newAdmin = await Admin.create([payload], { session });
    if (!newAdmin.length) {
      throw new Error('Failed to create admin');
    }
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};
const getMe = async (userId: string, role: string) => {
  let result = null;
  if (role === 'student') {
    result = await Students.findOne({ id: userId });
  } else if (role === 'faculty') {
    result = await FacultyModel.findOne({ id: userId });
  } else if (role === 'admin') {
    result = await Admin.findOne({ id: userId });
  }
  return result;
};
const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findOneAndUpdate({ id }, payload, { new: true });
  return result;
};
export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  changeStatus,
  getMe,
};
