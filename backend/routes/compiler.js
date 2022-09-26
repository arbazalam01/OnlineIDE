import { Router } from "express";
import { checkStatus, codeRunner } from "../controllers/compiler.js";

const router = Router();

router.post("/run", codeRunner);
router.get("/status", checkStatus);

export default router;
