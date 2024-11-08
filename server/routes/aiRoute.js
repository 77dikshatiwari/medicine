import Router from "express";
import aiController from "../controllers/aiController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/generate", aiController.generateResponse);
router.post("/save", verifyJWT, aiController.saveContent);

export default router;
