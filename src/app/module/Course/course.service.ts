import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearcableFields } from './course.constants';
import { TCourse, TCourseFaculty } from './course.interface';
import Courses, { CourseFaculty } from './course.model';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Courses.create(payload);
  return result;
};

const getAllCourseFromDB = async (query: Record<string, unknown>) => {
  const couresQuery = new QueryBuilder(
    Courses.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearcableFields)
    .filter()
    .sort()
    .paginate()
    .select();
  const result = await couresQuery.modelQuery;
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Courses.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Courses.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};
const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const updatedBasicCourseInfo = await Courses.findByIdAndUpdate(
      id,
      courseRemainingData,
      { new: true, runValidators: true, session },
    );
    if (!updatedBasicCourseInfo) {
      throw new Error('Failed to update  course');
    }
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // filter out the deleted field
      const deletedPreRequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);
      const deletedPreRequisitesCourses = await Courses.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!deletedPreRequisitesCourses) {
        throw new Error('Failed to update  course');
      }
      // Filter out the new course fields
      const newPreRequisites = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted,
      );
      const newPreRequisitesCourses = await Courses.findByIdAndUpdate(id, {
        $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
      });
      if (!newPreRequisitesCourses) {
        throw new Error('Failed to update  course');
      }
      await session.commitTransaction();
      await session.endSession();
    }
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
  return await Courses.findById(id).populate('preRequisiteCourses.course');
};

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  faculties: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: faculties } },
    },
    {
      upsert: true,
      new: true,
    },
  );
  return result;
};
const removeFacultiesWithCourseIntoDB = async (
  id: string,
  faculties: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: faculties } },
    },
    {
      new: true,
    },
  );
  return result;
};
export const CourseServices = {
  createCourseIntoDB,
  getAllCourseFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateCourseIntoDB,
  assignFacultiesWithCourseIntoDB,
  removeFacultiesWithCourseIntoDB,
};
