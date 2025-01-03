import { StudentServices } from './student.services';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
// import Joi from 'joi';
// Introducing higher order function

const getAllStudents = catchAsync(async (req, res) => {
  // service function will be called
  const result = await StudentServices.getAllStudentsFromDB(req.query);
  console.log('from controller', req.user);
  res.status(200).json({
    success: true,
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const result = await StudentServices.getSingleStudentFromDB(
    req.params.studentId,
  );
  res.status(200).json({ success: true, data: result });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentServices.deleteStudentFromDB(studentId);
  res.status(200).json({ success: true, data: result });
});

const udpateStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const { student } = req.body;

  const result = await StudentServices.updateStudentFromDB(studentId, student);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Data updated successfully',
    data: result,
  });
});

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  udpateStudent,
};
