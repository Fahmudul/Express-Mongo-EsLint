import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AcademicSemesterServices } from './AcademicSemester.services';
const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
    req.body,
  );
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: 'Academicsemester created successfully',
  });
});

const getAllSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAllSemesterFromDB();
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: 'Data fetched successfully',
  });
});

const getSingleSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getSingleSemesterFromDB(
    req.params.id,
  );
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: 'Data fetched successfully',
  });
});

const updateSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.updateSemesterFromDB(
    req.params.id,
    req.body,
  );
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: 'Data updated successfully',
  });
});
export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllSemester,
  getSingleSemester,
  updateSemester,
};
