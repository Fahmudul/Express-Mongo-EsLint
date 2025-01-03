import express from 'express';
import { AcademicSemesterControllers } from './AcademicSemesterController';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterValidation } from './AcademicSemester.validation';
const router = express.Router();
router.post(
  '/create-academic-semester',
  validateRequest(
    AcademicSemesterValidation.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.createAcademicSemester,
);
router.get('/get-all-semester', AcademicSemesterControllers.getAllSemester);
router.get(
  '/get-single-semester/:id',
  AcademicSemesterControllers.getSingleSemester,
);
router.patch(
  '/update-semester/:id',
  validateRequest(
    AcademicSemesterValidation.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.updateSemester,
);
export const AcademicSemesterRoutes = router;
