import { TAcademicSemester } from '../AcademicSemester/AcademicSemester.interface';
import { User } from './user.model';
const findLastStudentId = async () => {
  const lastStudent = await User.findOne({ role: 'student' }, { id: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean();
  return lastStudent?.id ? lastStudent.id : undefined;
};
export const generateStudentID = async (payload: TAcademicSemester) => {
  // console.log('from line 13', await findLastStudentId());
  let currentID = (0).toString();
  const lastStudentId = await findLastStudentId();
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  const lastStudentSemesterYear = lastStudentId?.substring(0, 4);
  if (
    lastStudentId &&
    lastStudentSemesterCode === payload.code &&
    lastStudentSemesterYear === payload.year
  ) {
    currentID = lastStudentId.substring(6);
  }
  let incrementId = (Number(currentID) + 1).toString().padStart(4, '0');
  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};

const findLastFacultyId = async () => {
  const lastFacultyId = await User.findOne(
    { role: 'faculty' },
    { id: 1, _id: 0 },
  )
    .sort({
      createdAt: -1,
    })
    .lean();
  return lastFacultyId?.id ? lastFacultyId.id.substring(2) : undefined;
};

export const generateFacultyId = async () => {
  let currentId = (0).toString();
  const lastFacultyId = await findLastFacultyId();
  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2);
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `F-${incrementId}`;
  return incrementId;
};

const findLastAdminId = async () => {
  const lastAdminId = await User.findOne({ role: 'admin' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();
  return lastAdminId?.id ? lastAdminId.id.substring(2) : undefined;
};

export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastAdminId();
  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }
  let incrementedId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementedId = `A-${incrementedId}`;
  return incrementedId;
};
