import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './userController';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidationSchemas } from '../Student/student.zod.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from './user.constant';
import { FacultySchema } from '../Faculty/Faculty.validation';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import { upload } from '../../utils/sendImageToCloudinary';
const router = express.Router();

router.post(
  '/create-student',
  // auth(USER_ROLES.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(StudentValidationSchemas.StudentValidationSchema),

  UserControllers.createStudent,
);

router.post(
  '/create-admin',
  // auth(USER_ROLES.admin),
  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin,
);
router.post(
  '/create-faculty',
  // auth(USER_ROLES.admin),
  validateRequest(FacultySchema),
  UserControllers.createFaculty,
);
router.post('/change-status/:id', auth('admin'), UserControllers.changeStatus);
router.get('/me', auth('admin', 'student', 'faculty'), UserControllers.getMe);

export const UserRoutes = router;
