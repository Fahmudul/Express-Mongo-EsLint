import express from 'express';
import AcademicDepartmentControllers from './AcademicDepartmentController';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidationSchemas } from './AcademicDepartmentValidation';
const router = express.Router();
router.post(
  '/create-academic-department',
  validateRequest(
    AcademicDepartmentValidationSchemas.createAcademicDepartmentValidation,
  ),
  AcademicDepartmentControllers.createAcademicDepartment,
);
router.get(
  '/get-all-department',
  AcademicDepartmentControllers.getAllAcademicDepartment,
);
router.get(
  '/get-single-department/:id',
  AcademicDepartmentControllers.getSingleAcademicDepartment,
);
router.patch(
  '/update-department/:id',
  validateRequest(
    AcademicDepartmentValidationSchemas.UpdateAcademicDepartmentValidation,
  ),
  AcademicDepartmentControllers.updateAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
