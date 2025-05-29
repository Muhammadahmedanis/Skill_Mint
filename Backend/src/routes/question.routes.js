import { Router } from "express";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import { addQuestionsToSession, togglePinQuestion, updateQuestionNote } from "../controllers/question.controller.js";

const questionRouter = Router();
questionRouter.route("/add").post(verifyJwt, addQuestionsToSession);
questionRouter.route("/:id/pin").put(verifyJwt, togglePinQuestion);
questionRouter.route("/:id/note").post(verifyJwt, updateQuestionNote);

export default questionRouter;