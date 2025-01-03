import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AcademicDepartmentServices } from './AcademicDepartment.services';

const createAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: 'Academic Department created successfully',
  });
});

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(
      req.params.id,
    );
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: 'Data fetched successfully',
  });
});

const getAllAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.getAllAcademicDepartmentFromDB();
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: 'Data fetched successfully',
  });
});

const updateAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.updateAcademicDepartmentFromDB(
      req.params.id,
      req.body,
    );
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: 'Academic Department updated successfully',
  });
});

const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getSingleAcademicDepartment,
  getAllAcademicDepartment,
  updateAcademicDepartment,
};
export default AcademicDepartmentControllers;
