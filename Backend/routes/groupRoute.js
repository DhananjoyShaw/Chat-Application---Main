import express from "express";
import { createGroup, getGroupDetails, sendMessageToGroup, getUserGroups, getGroupMessages } from "../controllers/groupController.js";
import upload from "../middleware/multer.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/create", isAuthenticated, upload.single("groupPhoto"), createGroup);
router.get("/", isAuthenticated, getUserGroups);
router.get("/:id", isAuthenticated, getGroupDetails);
router.post("/sendmessages/:id", isAuthenticated, upload.single("file"), sendMessageToGroup);
router.get("/getmessages/:id", isAuthenticated, getGroupMessages);

export default router;