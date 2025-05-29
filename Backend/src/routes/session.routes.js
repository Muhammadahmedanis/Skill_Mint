import { Router } from "express";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import { createSession, deleteSession, getMySessions, getSessionId } from "../controllers/session.controller.js";

const sessionRouter = Router();
sessionRouter.route("/create").post(verifyJwt, createSession);
sessionRouter.route("/my-sessions").get(verifyJwt, getMySessions);
sessionRouter.route("/:id").get(verifyJwt, getSessionId);
sessionRouter.route("/:id").delete(verifyJwt, deleteSession);

export default sessionRouter;