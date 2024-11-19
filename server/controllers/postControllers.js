import mongoose from "mongoose";
import * as postService from "../service/postService.js";

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await postService.getPostById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const postsData = await postService.getPosts(page);
    res.status(200).json(postsData);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const posts = await postService.getPostsBySearch(searchQuery, tags);
    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    // Ensure the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "No post with that ID" });
    }

    // Call the service to delete the post
    await postService.deletePost(id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  const postData = {
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  };

  try {
    const newPost = await postService.createPost(postData);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No post with id: ${id}`);
  }

  try {
    const updatedPost = await postService.commentOnPost(id, value);
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.json({ message: "Unauthenticated!" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No post with id: ${id}`);
  }

  try {
    const updatedPost = await postService.likePost(id, req.userId);
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No post with id: ${id}`);
  }

  try {
    const updatedPost = await postService.updatePost(id, post);
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
