import { Router } from "express";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { getUserProfile, logout, signin, signup } from "../controllers/auth.controller.js";

const authRouter = Router();
authRouter.route("/signup").post(upload?.single("profilePic"), signup);
authRouter.route("/login").post(signin);
authRouter.route("/logout").post(verifyJwt, logout);
authRouter.route("/getProfile").get(verifyJwt, getUserProfile);

export default authRouter;