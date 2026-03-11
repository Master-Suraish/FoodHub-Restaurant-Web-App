import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import userRoutes from "./features/users/users.routes";
import foodRoutes from "./features/foods/foods.routes";
import orderRoutes from "./features/orders/orders.routes";
import addressRoutes from "./features/address/address.routes";
import cartRoutes from "./features/carts/cart.routes";
import contactRoutes from "./features/contact/contact.route";
import { connectingToMongoDB } from "./config/mongodb";
import { checkJWT } from "./middlewares/auth.middleware";
import authRoutes from "./features/auth/auth.routes";
import { publicLimiter, userLimiter } from "./middlewares/rateLimiter";

const app = express();
const PORT = process.env.PORT || 3002;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join_order_room", (orderId: string) => {
    socket.join(orderId);
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected");
  });
});

app.set("socketio", io);

app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

connectingToMongoDB();

app.use("/api/auth", authRoutes);

app.use("/api/foods", publicLimiter, foodRoutes);
app.use("/api/contact", publicLimiter, contactRoutes);

app.use("/api/users", userLimiter, checkJWT, userRoutes);
app.use("/api/orders", userLimiter, checkJWT, orderRoutes);
app.use("/api/address", userLimiter, checkJWT, addressRoutes);
app.use("/api/cart", userLimiter, checkJWT, cartRoutes);

server.listen(PORT, () => {
  console.log(`Your Server is running on ${PORT}`);
});
