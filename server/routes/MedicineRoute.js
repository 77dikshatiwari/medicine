import { Router } from "express";
import medicineController from "../controllers/medicineController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/saveContent", verifyJWT, medicineController.saveContent);
router.post("/getContent", verifyJWT, medicineController.getContent);

export default router;

