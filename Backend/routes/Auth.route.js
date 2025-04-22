import { Router } from "express";
import { Login, SignUp } from "../controllers/Auth.controller.js";

const router = Router();

router.post("/sign-up", SignUp);
router.post("/login", Login);


export default router;
