import { TAcademicDepartment } from './AcademicDepartment.interface';
import { AcademicDepartMent } from './AcademicDepartment.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  // Checking if the department already exists
  const isDepartmentExist = await AcademicDepartMent.findOne({
    name: payload.name,
  });
  if (isDepartmentExist) {
    throw new Error('Department already exists');
  }

  const result = await AcademicDepartMent.create(payload);
  return result;
};

const getAllAcademicDepartmentFromDB = async () => {
  const result = await AcademicDepartMent.find({}).populate('academicFaculty');
  return result;
};

const getSingleAcademicDepartmentFromDB = async (id: string) => {
  const result = await AcademicDepartMent.findById(id);
  return result;
};

const updateAcademicDepartmentFromDB = async (
  id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartMent.updateOne({ _id: id }, payload);
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentFromDB,
  getSingleAcademicDepartmentFromDB,
  updateAcademicDepartmentFromDB,
};
