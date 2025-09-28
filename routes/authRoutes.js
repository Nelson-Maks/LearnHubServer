import express from "express"
import {registerUser, loginUser, getMe} from "../controllers/authControllers.js"
import protect from "../middleware/authMiddle.js";


const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/loginUser", loginUser);
authRouter.get("/me", protect, getMe);

export default authRouter;