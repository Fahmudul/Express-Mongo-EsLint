import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SemesterRegistrationServices } from './SemesterRegistration.service';
const createSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
      req.body,
    );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester Registration created successfully',
    data: result,
  });
});
const getAllSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.getAllSemesterRegistrationIntoDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester Registration fetched successfully',
    data: result,
  });
});

const getSingleSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.getSingleSemesterRegistrationIntoDB(
      req.params.id,
    );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester Registration fetched successfully',
    data: result,
  });
});
const updateSemesterRegistration = catchAsync(async (req, res) => {
  const result = await SemesterRegistrationServices.updateSemesterRegistration(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester Registration updated successfully',
    data: result,
  });
});
export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
};
