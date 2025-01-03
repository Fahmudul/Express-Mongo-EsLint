import express from 'express';
import { SemesterRegistrationController } from './SemesterRegistration.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidation } from './SemesterRegistrationValidation';
const router = express.Router();
router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationValidation,
  ),
  SemesterRegistrationController.createSemesterRegistration,
);
// router.get(
//   '/get-semester-registration',
//   SemesterRegistrationController.getAllSemesterRegistration,
// );
// router.get(
//   '/get-semester-registration/:id',
//   SemesterRegistrationController.getSingleSemesterRegistration,
// );
// router.patch(
//   '/update-semester-registration/:id',
//   validateRequest(
//     SemesterRegistrationValidation.updateSemesterRegistrationValidationSchema,
//   ),
//   SemesterRegistrationController.updateSemesterRegistration,
// );


export const SemesterRegistrationRoutes = router;