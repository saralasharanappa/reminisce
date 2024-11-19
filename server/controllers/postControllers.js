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



  export const createPost = async (req, res) => {
    const post = req.body;
  
    try {
      // Add userId from auth middleware to associate the post with the user
      const newPost = await postService.createPost({
        ...post,
        creator: req.userId,
        createdAt: new Date().toISOString(),
      });
  
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };