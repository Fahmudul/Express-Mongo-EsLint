import express from 'express';
import { CourseController } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidationSchemas } from './course.validation';
const router = express.Router();
router.post(
  '/create-course',
  validateRequest(CourseValidationSchemas.createCourseValidationSchema),
  CourseController.createCourse,
);
router.get('/get-all-courses', CourseController.getAllCourse);
router.get('/get-single-course/:id', CourseController.getSingleCourse);
router.patch('/delete-course/:id', CourseController.deleteCourse);
router.patch(
  '/update-course/:id',
  validateRequest(CourseValidationSchemas.updateCourseValidationSchema),
  CourseController.updateCourse,
);

router.put(
  '/:courseId/assign-faculty',
  validateRequest(CourseValidationSchemas.FacultiesWithCourseValidationSchema),
  CourseController.assignFaculties,
);

router.delete(
  '/:courseId/remove-faculty',
  validateRequest(CourseValidationSchemas.FacultiesWithCourseValidationSchema),
  CourseController.removeFaculties,
);

export const CourseRoutes = router;
