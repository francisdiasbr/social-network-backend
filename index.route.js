import express from 'express';

import authRoutes from './server/auth/auth.routes.js';
import usersRoutes from './server/user/user.routes.js';


const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);


export default router;