import { Router } from "express";
import * as authController from '../controller/auth.controller.js' 
const authRouter = Router();

authRouter.route('/auth/signup').post(authController.signUp)


export default authRouter
