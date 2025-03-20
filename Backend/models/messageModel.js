import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: function () { return !this.groupId; }
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: function () { return !this.receiverId; }
    },
    message: {
        type: String,
        required: function () { return !this.fileUrl; }
    },
    fileUrl: {
        type: String,
        default: null
    },
    fileName: {
        type: String,
        default: null
    },
    fileType: {
        type: String,
        default: null
    }
}, { timestamps: true });

export const Message = mongoose.model("Message", messageModel);