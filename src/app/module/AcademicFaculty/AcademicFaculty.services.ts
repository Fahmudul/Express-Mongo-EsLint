import { TAcademicFaculty } from './AcademicFaculty.interface';
import AcademicFaculty from './AcademicFaculty.model';
const getAllAcademicFacultyFromDB = async () => {
  const result = await AcademicFaculty.find({});
  return result;
};

const getSingleAcademicFacultyFromDB = async (id: string) => {
  const result = await AcademicFaculty.findById(id);
  return result;
};
const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload);
  return result;
};

const updateAcademicFacultyFromDB = async (
  id: string,
  payload: Partial<TAcademicFaculty>,
) => {
  const result = await AcademicFaculty.findOneAndUpdate(
    {
      _id: id,
    },
    payload,
    { new: true },
  );
  return result;
};
export const AcademicFacultyServices = {
  getAllAcademicFacultyFromDB,
  createAcademicFacultyIntoDB,
  getSingleAcademicFacultyFromDB,
  updateAcademicFacultyFromDB,
};
