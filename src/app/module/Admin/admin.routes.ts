import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import Admin from './admin.model';
import { AdminControllers } from './admin.controller';
// import {AdminContro}
const router = express.Router();
router.get('/', AdminControllers.getAllAdmins);
router.get('/:id', AdminControllers.getSingleAdmin);
router.patch(
  '/:id',
  validateRequest(updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);

router.delete('/:id', AdminControllers.deleteAdmin);

export const AdminRoutes = router;
