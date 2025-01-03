import { AcademicDepartMent } from '../AcademicDepartment/AcademicDepartment.model';
import AcademicFaculty from '../AcademicFaculty/AcademicFaculty.model';
import Courses from '../Course/course.model';
import FacultyModel from '../Faculty/Faculty.model';
import { SemesterRegistration } from '../SemesterRegistration/SemesterRegistration.Model';
import { TOfferedCourse } from './OfferedCourse.interface';
import { OfferedCourse } from './OfferedCourse.model';
import { hasTimeConflict } from './OfferedCourse.utils';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;
  const isSemesterRegistraionExists =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistraionExists) {
    throw new Error('Semester Registration does not exist');
  }
  const academicSemester = isSemesterRegistraionExists.academicSemester;
  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty);
  if (!isAcademicFacultyExists) {
    throw new Error('Academic Faculty does not exist');
  }
  const isAcademicDepartmentExists =
    await AcademicDepartMent.findById(academicDepartment);
  if (!isAcademicDepartmentExists) {
    throw new Error('Academic Department does not exist');
  }
  const isCourseExists = await Courses.findById(course);
  if (!isCourseExists) {
    throw new Error('Course does not exist');
  }
  const isFacultyExists = await FacultyModel.findById(faculty);
  if (!isFacultyExists) {
    throw new Error('Faculty does not exist');
  }
  const isDepartmentBelongToFaculty = await AcademicDepartMent.findOne({
    _id: academicDepartment,
    academicFaculty,
  });
  if (!isDepartmentBelongToFaculty) {
    throw new Error('Department does not belong to faculty');
  }
  const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({ semesterRegistration, course, section });
  if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new Error('Same Offered Course already exists');
  }
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');
  const newSchedule = { days, startTime, endTime };
  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new Error('This faculty is not available at this time');
  }
  console.log('from service', { academicSemester, ...payload });

  const result = await OfferedCourse.create({ academicSemester, ...payload });
  return result;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;
  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new Error('Offered Course does not exist');
  }
  const isFacultyExists = await FacultyModel.findById(faculty);
  if (!isFacultyExists) {
    throw new Error('Faculty does not exist');
  }
  const semesterRegistration = isOfferedCourseExists?.semesterRegistration;
  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration);
  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new Error('Semester Registration is not upcoming');
  }
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');
  const newSchedule = { days, startTime, endTime };
  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new Error('Time conflict');
  }
  const result = await OfferedCourse.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the semester registration status is upcoming
   * Step 3: delete the offered course
   */
  const isOfferedCourseExists = await OfferedCourse.findById(id);

  if (!isOfferedCourseExists) {
    throw new Error('Offered Course not found');
  }

  const semesterRegistation = isOfferedCourseExists.semesterRegistration;

  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistation).select('status');

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new Error(
      `Offered course can not update ! because the semester ${semesterRegistrationStatus}`,
    );
  }

  const result = await OfferedCourse.findByIdAndDelete(id);

  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  updateOfferedCourseIntoDB,
  deleteOfferedCourseFromDB,
};
