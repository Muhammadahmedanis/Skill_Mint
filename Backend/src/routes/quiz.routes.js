import { Router } from 'express';
import { verifyJwt } from '../middlewares/authMiddleware.js';
import { getQProgress } from '../controllers/quiz.controller.js';

const quizRouter = Router();
quizRouter.route("/").get(verifyJwt, getQProgress);

export default quizRouter;