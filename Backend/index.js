import express from 'express';
import dotenv from "dotenv";
dotenv.config({});
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import groupRoute from "./routes/groupRoute.js"
import cookieParser from "cookie-parser";
import { app, server } from "./socket/socket.js";
import cors from "cors";


const PORT = process.env.PORT || 5000;
// const app = express();

// middleware
app.use(cors({
    origin: 'https://chat-application-frontend-jtzm.onrender.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/group", groupRoute);

server.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at prot ${PORT}`);
});