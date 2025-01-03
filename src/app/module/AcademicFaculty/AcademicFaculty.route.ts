import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyValidationSchemas } from './AcademicFaculty.validation';
import { AcademicFacultyControllers } from './AcademicFacultyController';
const router = express.Router();
router.post(
  '/create-academic-faculty',
  // validateRequest(
  //   AcademicFacultyValidationSchemas.CreateAcademicFacultyValidationSchema,
  // ),
  AcademicFacultyControllers.createAcademicFaculty,
);

router.get('/:id', AcademicFacultyControllers.getSingleAcademicFaculty);
router.patch(
  '/:id',
  validateRequest(
    AcademicFacultyValidationSchemas.UpdateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.updateAcademicFacultyFromDB,
);

router.get('/', AcademicFacultyControllers.getAllAcademicFaculty);

export const AcademicFacultyRoutes = router;
