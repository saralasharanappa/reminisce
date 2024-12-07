import mongoose from "mongoose";
import * as postService from "../service/postService.js";

/**
 * Retrieves a specific post by its ID.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with post data or error message
 */
export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // Fetch the post
    const post = await postService.getPostById(id);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Return the post
    res.status(200).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

/**
 * Retrieves a paginated list of posts.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with posts data or error message
 */
export const getPosts = async (req, res) => {
  console.log("GET POSTS - Request received");
  const { page } = req.query;
  
  try {
    console.log("Fetching posts for page:", page);
    const postsData = await postService.getPosts(page);
    console.log("Posts retrieved successfully:", {
      currentPage: postsData.currentPage,
      totalPosts: postsData.data.length,
      totalPages: postsData.numberOfPages
    });
    
    res.status(200).json(postsData);
  } catch (error) {
    console.error("Error in getPosts controller:", error);
    res.status(500).json({ 
      message: "Failed to fetch posts", 
      error: error.message 
    });
  }
};

/**
 * Searches for posts based on a search query and tags.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with matching posts or error message
 */
// export const getPostsBySearch = async (req, res) => {
//   const { searchQuery, tags } = req.query;

//   try {
//     const posts = await postService.getPostsBySearch(searchQuery, tags);

//     if (!posts || posts.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No posts found matching the search criteria" });
//     }

//     res.status(200).json({ data: posts });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  
  console.log('Search request:', { searchQuery, tags });

  try {
    const posts = await postService.getPostsBySearch(searchQuery, tags);
    console.log('Found posts:', posts.length);

    if (!posts || posts.length === 0) {
      return res
        .status(404)
        .json({ message: "No posts found matching the search criteria" });
    }

    res.status(200).json({ data: posts });
  } catch (error) {
    console.error('Search error:', error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await postService.getPostById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await postService.deletePost(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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

    if (!newPost) {
      return res.status(400).json({ message: "Failed to create post" });
    }

    res.status(201).json(newPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const updatedPost = await postService.commentOnPost(id, value);

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not authenticated" });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const updatedPost = await postService.likePost(id, req.userId);

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const updatedPost = await postService.updatePost(id, post);

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
