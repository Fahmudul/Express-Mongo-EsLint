import { SemesterRegistration } from './../SemesterRegistration/SemesterRegistration.Model';
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Course from '../Course/course.model';
import FacultyModel from '../Faculty/Faculty.model';
import { OfferedCourse } from '../OfferedCourse/OfferedCourse.model';
import Student from '../Student/student.model';
import {
  TEnrolledCourse,
  TEnrolledCourseMarks,
} from './EnrolledCourse.interface';
import EnrolledCourse from './EnrolledCourse.model';
import { calculateGradeAndPoints } from './EnrolledCourse.utils';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  /**
   * Step1: Check if the offered cousres is exists
   * Step2: Check if the student is already enrolled
   * Step3: Check if the max credits exceed
   * Step4: Create an enrolled course
   */

  const { offeredCourse } = payload;
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new Error('Offered course not found');
  }
  const student = await Student.findOne({ id: userId }).select('id');

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    student: student?._id,
    offeredCourse,
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
  });
  if (isStudentAlreadyEnrolled) {
    throw new Error('Student is already enrolled');
  }
  // check total credits exceeds max credit
  const course = await Course.findById(isOfferedCourseExists?.course);
  const currentCredit = course?.credits;

  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExists?.semesterRegistration,
  ).select('maxCredit');
  const maxCredit = semesterRegistration?.maxCredit;

  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        student: student?._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ]);
  const totalCredits = enrolledCourses.length
    ? enrolledCourses[0].totalEnrolledCredits
    : 0;
  if (maxCredit && totalCredits + currentCredit > maxCredit) {
    throw new Error('Max credit is exceeded');
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExists.semesterRegistration,
          academicSemester: isOfferedCourseExists.academicSemester,
          academicFaculty: isOfferedCourseExists.academicFaculty,
          academicDepartment: isOfferedCourseExists.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExists.course,
          student: student._id,
          faculty: isOfferedCourseExists.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    if (!result) {
      throw new Error('Failed to enroll in this cousre !');
    }

    const maxCapacity = isOfferedCourseExists.maxCapacity;
    await OfferedCourse.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, student, courseMarks, offeredCourse } = payload;
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new Error('Semester registration not found');
  }
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new Error('Offered course not found');
  }
  const isStudentExists = await Student.findById(student);
  if (!isStudentExists) {
    throw new Error('Student not found');
  }
  const faculty = await FacultyModel.findOne({ id: facultyId }, { _id: 1 });
  if (!faculty) {
    throw new Error('Faculty not found');
  }
  
  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty._id,
  });
  if (!isCourseBelongToFaculty) {
    throw new Error('You are not allowed to update marks');
  }
  const modifiedUpdatedData: Record<string, unknown> = { ...courseMarks };
  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm, finalTerm } = courseMarks;
    const totalMarks =
      classTest1 * 0.1 + classTest2 * 0.1 + midTerm * 0.3 + finalTerm * 0.5;
    const result = calculateGradeAndPoints(totalMarks);
    modifiedUpdatedData.grade = result.grade;
    modifiedUpdatedData.gradePoints = result.gradePoints;
    modifiedUpdatedData.isCompleted = true;
  }
  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedUpdatedData[`courseMarks.${key}`] = value;
    }
  }
  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedUpdatedData,
    { new: true },
  );
  return result;
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
};
