import express from 'express';

import usersRoutes from './server/users/users.routes.js';


const router = express.Router();

router.use('/users', usersRoutes);

export default router;