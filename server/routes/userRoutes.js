import express from "express";
import { signin, signup } from "../controllers/userController.js";

const router = express.Router();

// signup route
router.post("/signup", signup);
// sigin route
router.post("/signin", signin);

export default router;