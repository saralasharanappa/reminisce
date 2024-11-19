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