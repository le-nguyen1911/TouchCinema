import express from "express";
import cors from "cors";
import "dotenv/config";
import connectdb from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"

const app = express();
const port = 3000;

await connectdb();

// middleware
app.use(express.json());
app.use(cors());

app.use(clerkMiddleware());
// api
app.get("/", (req, res) => res.send("server dang chay"));
app.use("/api/inngest", serve({ client: inngest, functions }));
app.listen(port, () => console.log(`server dang chay tren port: ${port}`));
