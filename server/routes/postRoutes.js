import express from "express";
import {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  commentPost,
  likePost,
  getPostsBySearch,
} from "../controllers/postControllers.js";
import auth from "../middleware/auth.js";

const router = express.Router();
// Route for searching posts
router.get("/search", getPostsBySearch);

// Route for getting all posts
router.get("/", getPosts);

// Route for getting a specific post by ID
router.get("/:id", getPost);

// Route for creating a new post (protected)
router.post("/", auth, createPost);

// Route for deleting a post (protected)
router.delete("/:id", auth, deletePost);

// Route for commenting on a post
router.post("/:id/commentPost", auth, commentPost);

// Route for liking a post
router.patch("/:id/likePost", auth, likePost);

// Route for updating a post
router.patch("/:id", auth, updatePost);

export default router;
