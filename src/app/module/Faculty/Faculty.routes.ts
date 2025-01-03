import express from 'express';
import { FacultyControllers } from './Faculty.controllers';
import auth from '../../middlewares/auth';
const router = express.Router();

// Get all Faculty
router.get('/get-all-faculty', FacultyControllers.getAllFaculty);
// get Single Faculty
router.post('/get-single-faculty', FacultyControllers.getSingleFaculty);
// update faculty information
router.post('/udpate-faculty', FacultyControllers.updateFaculty);
// Delete Faculty
router.post('/delete-faculty', FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
