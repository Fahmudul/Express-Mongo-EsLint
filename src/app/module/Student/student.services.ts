import mongoose from 'mongoose';
import Students from './student.model';
import { User } from '../user/user.model';
import { Student } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { searchableFields } from './student.constants';
// import { Student, StudentModel } from './student.interface';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // console.log('from line 8', query);
  // let searchTerm = '';
  // if (query?.searchTerm) {
  //   searchTerm = query.searchTerm as string;
  // }
  // const searchQuery = Students.find({
  //   $or: ['email', 'name.firstName', 'presentAddress'].map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });
  // const queryObj = { ...query };
  // const excludeFields = ['searchTerm', 'sort', 'page', 'limit', 'fields'];
  // excludeFields.forEach((elem) => delete queryObj[elem]);
  // const filteredQuery = searchQuery
  //   .find(queryObj)
  //   .populate('admissionSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //     },
  //   });
  // // sorting
  // let sort = '-email';
  // if (query.sort) {
  //   sort = query.sort as string;
  // }
  // const sortQuery = filteredQuery.sort(sort);

  // // Limit
  // let limit = 10;
  // let page = 1;
  // if (query.limit) {
  //   limit = Number(query.limit);
  // }
  // let skip = 0;
  // // Pagination
  // if (query.page) {
  //   page = Number(query.page) - 1;
  //   skip = page * limit;
  //   console.log(skip);
  // }
  // const paginatedQuery = sortQuery.skip(skip);
  // const limitQuery = paginatedQuery.limit(limit);
  // // Field limiting
  // let fields = '-__v';
  // if (query.fields) {
  //   fields = (query.fields as string).split(',').join(' ');
  // }
  // const selectedFieldQuery = limitQuery.select(fields);
  // const result = await selectedFieldQuery;
  // const result = await Students.find();
  const queryBuilder = new QueryBuilder(
    Students.find()
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .select();
  const result = await queryBuilder.modelQuery;
  // console.log(result);
  return result;
};
// * Get single student using aggregation
// const getSingleStudentFromDB = async (id: string) => {
//   const result = await Students.aggregate([
//     {
//       $match: { id },
//     },
//   ]);
//   return result;
// };

// * Get single student using populate
const getSingleStudentFromDB = async (id: string) => {
  const result = await Students.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};
const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedStudent = await Students.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new Error('Failed to delete student');
    }
    const deletedUser = await User.findOneAndUpdate(
      { id },
      {
        isDeleted: true,
      },
      {
        new: true,
        session,
      },
    );
    if (!deletedUser) {
      throw new Error('Failed to delete user');
    }
    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
  }
};

const updateStudentFromDB = async (id: string, payload: Partial<Student>) => {
  const { name, localGuardian, guardian, ...remaining } = payload;
  const modifiedStudentData = {
    ...remaining,
  };
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedStudentData[`name.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedStudentData[`localGuardian.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedStudentData[`guardian.${key}`] = value;
    }
  }
  // console.log('modified student data', modifiedStudentData);
  const result = await Students.findOneAndUpdate({ id }, modifiedStudentData, {
    new: true,
  });
  return result;
};
export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentFromDB,
};
