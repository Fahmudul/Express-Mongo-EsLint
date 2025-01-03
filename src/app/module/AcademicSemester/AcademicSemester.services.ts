import { TAcademicSemester } from './AcademicSemester.interface';
import { AcademicSemester } from './AcedemicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  // Check if semester name has valid code
  const AcademicSemesterNameCodeMapper = {
    Autumn: '01',
    Summer: '02',
    Fall: '03',
  };
  if (AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester Code');
  }
  const result = await AcademicSemester.create(payload);
  return result;
};
const getAllSemesterFromDB = async () => {
  const result = await AcademicSemester.find({});
  return result;
};

const getSingleSemesterFromDB = async (id: string) => {
  const result = await AcademicSemester.find({ _id: id });
  return result;
};

const updateSemesterFromDB = async (id: string, payload: TAcademicSemester) => {
  const result = await AcademicSemester.updateOne({ _id: id }, payload);
  return result;
};
export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllSemesterFromDB,
  getSingleSemesterFromDB,
  updateSemesterFromDB,
};
