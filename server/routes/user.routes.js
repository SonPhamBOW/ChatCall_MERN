import { Router } from "express";
import * as userController from '../controller/user.controller.js' 
import { protectedRoute } from "../middleware/auth.middleware.js";
const userRouter = Router();

userRouter.use(protectedRoute)

userRouter.post("/auth/onboarding", userController.onBoard)

userRouter.get("/auth/me",  userController.getMe)
userRouter.get("/recommend", userController.getRecommendedFriends)
userRouter.get("/friends", userController.getMyFriends)

export default userRouter