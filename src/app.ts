import { AcademicSemesterRoutes } from './app/module/AcademicSemester/AcademicSemester.route';
/* eslint-disable no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
// import cors from 'cors';
import { StudentRoutes } from './app/module/Student/student.route';
import { UserRoutes } from './app/module/user/user.route';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notfound';
import { AcademicFacultyRoutes } from './app/module/AcademicFaculty/AcademicFaculty.route';
import { AcademicDepartmentRoutes } from './app/module/AcademicDepartment/AcademicDepartment.routes';
import { AuthRoutes } from './app/module/Auth/auth.route';
import cookieParser from 'cookie-parser';
import { CourseRoutes } from './app/module/Course/course.route';
import { FacultyRoutes } from './app/module/Faculty/Faculty.routes';
import { SemesterRegistrationRoutes } from './app/module/SemesterRegistration/SemesterRegistration.routes';
import { OfferedCourseRoutes } from './app/module/OfferedCourse/OfferedCourse.routes';
import { EnrolledCourseRoutes } from './app/module/EnrolledCourse/EnrolledCourse.routes';
const app = express();
app.use(express.json());
app.use(cookieParser());

// application routes
app.use('/api/v1/students', StudentRoutes);
app.use('/api/v1/users', UserRoutes);
app.use('/api/v1/academic-semester', AcademicSemesterRoutes);
app.use('/api/v1/academic-faculties', AcademicFacultyRoutes);
app.use('/api/v1/academic-departments', AcademicDepartmentRoutes);
app.use('/api/v1/faculties', FacultyRoutes);
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/courses', CourseRoutes);
app.use('/api/v1/semester-registrations', SemesterRegistrationRoutes);
app.use('/api/v1/offered-courses', OfferedCourseRoutes);
app.use('/api/v1/enrolled-courses', EnrolledCourseRoutes);

// global error handling function
app.use(globalErrorHandler);
// app.get('/', async (req: Request, res: Response) => {
//   //
//   Promise.reject();
// });

// Not found route
app.use(notFound);

export default app;
