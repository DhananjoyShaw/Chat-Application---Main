import express from "express";
import { getMessage, sendMessage } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated, upload.single("file"), sendMessage);
router.route("/:id").get(isAuthenticated, getMessage);

export default router;