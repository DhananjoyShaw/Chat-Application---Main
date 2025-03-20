import { Group } from "../models/groupModel.js";
import { User } from "../models/userModel.js";
import { Message } from "../models/messageModel.js";
import { io } from "../socket/socket.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createGroup = async (req, res) => {
    try {
        const { name } = req.body;
        const members = JSON.parse(req.body.members);
        const adminId = req.id;

        if (!name || !members || members.length === 0) {
            return res.status(400).json({ message: "Group name and members are required" });
        }

        const usersExist = await User.find({ _id: { $in: members } });
        if (usersExist.length !== members.length) {
            return res.status(400).json({ message: "Some members do not exist" });
        }

        let groupPhoto = "";
        if (req.file) {
            const uploadResponse = await uploadOnCloudinary(req.file.path);
            if (uploadResponse) groupPhoto = uploadResponse.secure_url;
        }

        const newGroup = await Group.create({
            name,
            admin: adminId,
            members: [...members, adminId],
            groupPhoto,
        });

        return res.status(201).json(newGroup);
    } catch (error) {
        console.error("Error creating group:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserGroups = async (req, res) => {
    try {
        const userId = req.id;
        const groups = await Group.find({ members: userId }).populate("members", "-password");

        return res.status(200).json(groups);
    } catch (error) {
        console.error("Error fetching user groups:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getGroupDetails = async (req, res) => {
    try {
        const groupId = req.params.id;

        // Find the group and populate members and messages
        const group = await Group.findById(groupId)
            .populate("members", "-password")
            .populate({
                path: "messages",
                populate: { path: "senderId", select: "username profilePhoto" },
            });

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        return res.status(200).json(group);
    } catch (error) {
        console.error("Error fetching group details:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const sendMessageToGroup = async (req, res) => {
    try {
        const senderId = req.id;
        const groupId = req.params.id;
        const { message } = req.body;
        const file = req.file;

        // Check if both message and file are empty
        if (!message && !file) {
            return res.status(400).json({ message: "Message or file is required" });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (!group.members.includes(senderId)) {
            return res.status(403).json({ message: "User is not a member of this group" });
        }

        let fileUrl = null;
        let fileName = null;
        let fileType = null;

        if (file) {
            const result = await uploadOnCloudinary(file.path);
            if (result) {
                fileUrl = result.secure_url;
                fileName = file.originalname;
                fileType = file.mimetype;
            }
        }

        const newMessage = await Message.create({
            senderId,
            message: message || "",
            groupId: groupId,
            fileUrl,
            fileName,
            fileType
        });

        if (newMessage) {
            group.messages.push(newMessage._id);
        }

        await Promise.all([group.save(), newMessage.save()]);
        await newMessage.populate("senderId", "username profilePhoto");

        io.to(groupId).emit("newGroupMessage", newMessage);

        return res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message to group:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Get Group messages
export const getGroupMessages = async (req, res) => {
    try {
        const groupId = req.params.id;

        const group = await Group.findById(groupId)
            .populate({
                path: "messages",
                populate: { path: "senderId", select: "username profilePhoto" },
            });

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Extract messages array from the group and send it in the response
        const messages = group.messages;
        return res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching group messages:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

