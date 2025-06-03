import express from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import helmet from "helmet";
import cookieParser from "cookie-parser";
// import mongoSanitize from "express-mongo-sanitize";
import authRouter from "./routes/auth.routes.js";
import { verifyJwt } from "./middlewares/authMiddleware.js";
import sessionRouter from "./routes/session.routes.js";
import questionRouter from "./routes/question.routes.js";
import { generateConceptExplanation, generateInterviewQuestion, genrateQuiz, submitQuiz } from "./controllers/ai.controller.js";
import quizRouter from "./routes/quiz.routes.js";


const app = express();
// Middleware Configurations
app.use(cors({
  origin: [process.env.ALLOWED_ORIGIN_1, process.env.ALLOWED_ORIGIN_2],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"]
}));


app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static("public"));
app.use(cookieParser());
// app.use(mongoSanitize());
app.use(helmet());

app.get("/", (req, res) => {
  res.send("Welcome to My Page")
})

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/session", sessionRouter);
app.use("/api/v1/question", questionRouter);
app.use("/api/v1/quiz", quizRouter);
app.use("/api/v1/ai/generate-questions", verifyJwt, generateInterviewQuestion);
app.use("/api/v1/ai/generate-explanation", verifyJwt, generateConceptExplanation);
app.use("/api/v1/ai/generate-quiz", verifyJwt, genrateQuiz);
app.use("/api/v1/ai/submit-quiz", verifyJwt, submitQuiz);




// Handle Undefined Routes
app.all(/.*/, (req, res) => {
  res.status(StatusCodes.NOT_FOUND).send({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

export { app };