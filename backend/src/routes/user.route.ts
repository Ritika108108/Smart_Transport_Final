'use strict';
import express from 'express'
const router = express.Router();
import { celebrate } from 'celebrate';
import userSchema from './schemas/user.schema';
import userController from '../controllers/user.controller';


router.post('/log-in', userController.loginWithEmail);


/************* User management **************/

export default router;
