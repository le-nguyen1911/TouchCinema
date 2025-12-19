import express from "express";
import cors from "cors";
import "dotenv/config";
import connectdb from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";

import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import path from "path";

import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();
const port = 3000;

await connectdb();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/ai", aiRoutes);
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/comment", commentRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.get("/", (req, res) => res.send("TouchCinema Backend Running OK"));

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
