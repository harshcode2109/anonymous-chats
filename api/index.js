import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoute from "./routes/auth.js";
import postRoute from "./routes/post.js";
import commentRoute from "./routes/comment.js";
import userRoute from "./routes/user.js";
import feedbackRoute from "./routes/feedback.js";

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://college-anonymous.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Access-Control-Allow-Origin"],
  },
});


// Store active chat rooms
let rooms = {};

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(
  cors({
    origin: ["https://college-anonymous.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);
app.use("/api/user", userRoute);
app.use("/api/feedback", feedbackRoute);

// Socket.IO logic
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.emit("updateRooms", Object.values(rooms));

  socket.on("getRooms", () => {
    socket.emit("updateRooms", Object.values(rooms));
  });

  // Create a new room
  socket.on("createRoom", (roomName) => {
    if (!rooms[roomName]) {
      rooms[roomName] = { users: [], name: roomName };
      io.emit("updateRooms", Object.values(rooms)); // Update room list
    }
  });

  socket.on("exitRoom", (roomName) => {
    if (rooms[roomName]) {
      rooms[roomName].users = rooms[roomName].users.filter(
        (id) => id !== socket.id
      );
      socket.leave(roomName);

      if (rooms[roomName].users.length === 0) {
        delete rooms[roomName]; // Remove empty room
      }

      io.emit("updateRooms", Object.values(rooms)); // Update room list
    }
  });

  // Join an existing room
  socket.on("joinRoom", (roomName) => {
    if (rooms[roomName]) {
      rooms[roomName].users.push(socket.id);
      socket.join(roomName);
      io.emit("updateRooms", Object.values(rooms)); // Update room list
    }
  });

  // Send and receive messages
  socket.on("sendMessage", ({ roomName, message, username }) => {
    io.to(roomName).emit("receiveMessage", { senderId: username, message });
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    for (const room in rooms) {
      rooms[room].users = rooms[room].users.filter((id) => id !== socket.id);
      if (rooms[room].users.length === 0) delete rooms[room]; // Remove empty rooms
    }
    io.emit("updateRooms", Object.values(rooms)); // Update room list
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
