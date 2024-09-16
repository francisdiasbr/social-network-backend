import express from 'express';

import UserController from './user.controller.js';


const UserCtrl = new UserController();

const router = express.Router();

router.route('/')
  .post(UserCtrl.create);


export default router;
