import { Router } from "express";
import { createClient, DeleteClient, getAllClient, getClientDetails, UpdateClient } from "../controllers/Client.controller.js";
import { VerifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.post("/create-client",VerifyToken, createClient);
router.get("/get-client/:id",VerifyToken, getClientDetails);
router.get("/get-all-client", getAllClient);
router.patch("/update-client/:id", VerifyToken,UpdateClient);
router.delete("/delete-client/:id",VerifyToken, DeleteClient);

export default router;
