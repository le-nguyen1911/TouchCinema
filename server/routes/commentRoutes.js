import express from "express";
import {
  addComment,
  getCommentsByMovie,
  deleteComment,
  getAllComments,
} from "../controllers/commentController.js";
import { protectAdmin } from "../middleware/auth.js";

const commentRouter = express.Router();

commentRouter.get("/all", protectAdmin, getAllComments);
commentRouter.get("/:movieId", getCommentsByMovie);
commentRouter.post("/add", protectAdmin, addComment);
commentRouter.delete("/:id", protectAdmin, deleteComment);

export default commentRouter;
