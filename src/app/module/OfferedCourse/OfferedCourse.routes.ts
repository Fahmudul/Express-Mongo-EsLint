import express from 'express';
import { OfferedCourseControllers } from './OfferedCourse.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseValidation } from './OfferedCourse.validation';

const router = express.Router();
router.post(
  '/create-offered-course',
  validateRequest(OfferedCourseValidation.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);
// router.get('/get-all-offered-courses', OfferedCourseControllers.getAllOfferedCourse);
// router.get(
//   '/get-single-offered-course/:id',
//   OfferedCourseControllers.getSingleOfferedCourse,
// );
// router.patch(
router.patch(
  '/update-offered-course/:id',
  validateRequest(OfferedCourseValidation.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);

export const OfferedCourseRoutes = router;
