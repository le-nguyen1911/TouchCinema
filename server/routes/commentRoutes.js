import express from "express";
import {
  addComment,
  getCommentsByMovie,
  deleteComment,
  getAllComments,
} from "../controllers/commentController.js";
import { protectAdmin } from "../middleware/auth.js";
import { requireAuth } from "@clerk/express";

const commentRouter = express.Router();

commentRouter.get("/all", protectAdmin, getAllComments);
commentRouter.get("/:movieId", getCommentsByMovie);
commentRouter.post("/add", requireAuth(), addComment);
commentRouter.delete("/:id", requireAuth(), protectAdmin,deleteComment);

export default commentRouter;
