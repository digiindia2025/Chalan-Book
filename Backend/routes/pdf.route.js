import { Router } from "express";
import { GeneratePdf } from "../controllers/pdf.controller.js";
import { VerifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.post("/generate-pdf",GeneratePdf);

export default router