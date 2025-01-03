import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AcademicFacultyServices } from './AcademicFaculty.services';

const createAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(
    req.body,
  );
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: 'Academic Faculty created successfully',
  });
});

const getAllAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.getAllAcademicFacultyFromDB();
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: 'Data fetched successfully',
  });
});

const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.getSingleAcademicFacultyFromDB(
    req.params.id,
  );

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: 'Data fetched successfully',
  });
});

const updateAcademicFacultyFromDB = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.updateAcademicFacultyFromDB(
    req.params.id,
    req.body,
  );
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: 'Data updated successfully',
  });
});
export const AcademicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculty,
  getSingleAcademicFaculty,
  updateAcademicFacultyFromDB,
};
