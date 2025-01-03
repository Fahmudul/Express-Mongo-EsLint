import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { FacultyServices } from './Faculty.services';
import sendResponse from '../../utils/sendResponse';

const getAllFaculty = catchAsync(async (req, res) => {
  const data = await FacultyServices.getAllFacultyFromDB(req.query);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Date fetched successfully',
    data,
  });
});

const getSingleFaculty = catchAsync(async (req, res) => {
  const data = await FacultyServices.getSingleFacultyFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Date fetched successfully',
    data,
  });
});

const updateFaculty = catchAsync(async (req, res) => {
  const data = await FacultyServices.updateFacultyToDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty updated successfully',
    data,
  });
});

const deleteFaculty = catchAsync(async (req, res) => {
  const data = await FacultyServices.deleteFacultyFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty deleted successfully',
    data,
  });
});

export const FacultyControllers = {
  getAllFaculty,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
};
