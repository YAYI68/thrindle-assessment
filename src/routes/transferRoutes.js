import { Router } from "express";
import {
  allTransactions,
  makeTranfer,
  verifyTransfer,
} from "../controllers/transferController.js";
import { protectUser } from "../middleware/authMiddleware.js";

// import { loginUser, registerUser } from "../controllers/userController.js";

const router = Router();

router.use(protectUser);
router.post("/", makeTranfer);
router.get("/verify/:reference", verifyTransfer);
router.get("/transactions", allTransactions);

export default router;
