import mongoose from 'mongoose';
import { AcademicSemester } from '../AcademicSemester/AcedemicSemester.model';
import { SemesterRegistration } from './SemesterRegistration.Model';
import { TSemesterRegistration } from './SemesterRegistration.interface';
import { OfferedCourse } from '../OfferedCourse/OfferedCourse.model';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;
  // Check if the there any registered semester that is already "UPCOMING" | "ONGOING"
  const isThereAnyUpcomingOrOngoingRegistration =
    await SemesterRegistration.findOne({
      $or: [{ status: 'UPCOMING' }, { status: 'ONGOING' }],
    });
  if (isThereAnyUpcomingOrOngoingRegistration) {
    throw new Error(
      `There is already a registration that is ${isThereAnyUpcomingOrOngoingRegistration.status}`,
    );
  }
  // check if semester is exists
  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester);
  if (!isAcademicSemesterExists) {
    throw new Error('Academic Semester does not exist');
  }
  const isSemesterRegistrationExist = await SemesterRegistration.findOne({
    academicSemester,
  });
  if (isSemesterRegistrationExist) {
    throw new Error('Semester Registration already exists');
  }
  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationIntoDB = async () => {
  const result = await SemesterRegistration.find({});
  return result;
};

const getSingleSemesterRegistrationIntoDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};
const updateSemesterRegistration = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  const requestedStatus = payload?.status;
  if (!isSemesterRegistrationExists) {
    throw new Error('Semester Registration does not exist');
  }
  const currentSemesterStatus = isSemesterRegistrationExists.status;

  if (currentSemesterStatus === 'ENDED') {
    throw new Error('Semester Registration has already ended');
  }
  if (currentSemesterStatus === 'UPCOMING' && requestedStatus === 'ENDED') {
    throw new Error('Upcoming semester cant be modifed to Ended');
  }
  if (currentSemesterStatus === 'ONGOING' && requestedStatus === 'UPCOMING') {
    throw new Error('Ongoing semester cant be modifed to Upcoming');
  }
  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  if (!isSemesterRegistrationExists) {
    throw new Error('Semester Registration does not exist');
  }
  const semesterRegistration = isSemesterRegistrationExists.status;
  if (semesterRegistration !== 'UPCOMING') {
    throw new Error('Semester Registration can not be deleted');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedOfferedCourse = await OfferedCourse.deleteMany(
      {
        semesterRegistration: id,
      },
      { session },
    );
    if (!deletedOfferedCourse) {
      throw new Error('Failed to delete semester registration');
    }
    const deletedSemesterRegistration =
      await SemesterRegistration.findByIdAndDelete(id, { session, new: true });
    if (!deletedSemesterRegistration) {
      throw new Error('Failed to delete semester registration');
    }
    await session.commitTransaction();
    await session.endSession();
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
  const result = await SemesterRegistration.findByIdAndDelete(id);
  return result;
};
export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationIntoDB,
  getSingleSemesterRegistrationIntoDB,
  updateSemesterRegistration,
  deleteSemesterRegistrationFromDB,
};
