import express from 'express';
import { StudentController } from './studentcontroller';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidationSchemas } from './student.zod.validation';
import auth from '../../middlewares/auth';
const router = express.Router();

// Controller function will be called from here
// router.post('/create-student', StudentController.createStudent);
router.get('/get-all-students', StudentController.getAllStudents);
router.get(
  '/:studentId',
  auth('admin', 'faculty'),
  StudentController.getSingleStudent,
);
router.delete('/:studentId', StudentController.deleteStudent);
router.patch(
  '/:studentId',
  validateRequest(StudentValidationSchemas.UpdateStudentValidationSchema),
  StudentController.udpateStudent,
);
export const StudentRoutes = router;
