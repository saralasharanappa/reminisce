import request from "supertest";
import app from "../index.js";
import * as postService from "../service/postService.js";
import { connectDB, disconnectDB } from "./setupTestDB.js";

// Mock postService and auth middleware
jest.mock("../service/postService.js");
jest.mock("../middleware/auth.js", () => (req, res, next) => {
  req.userId = "mockedUserId";
  next();
});

// Define a global postId for tests
const postId = "64bf8f84924b89a01cb8a234";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("POST APIs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /posts", () => {
    it("Should return paginated posts", async () => {
      const mockResponse = {
        data: [{ _id: postId, title: "Test Post", message: "Test Message" }],
        currentPage: 1,
        numberOfPages: 1,
      };

      postService.getPosts.mockResolvedValue(mockResponse);

      const res = await request(app).get("/posts?page=1");

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.currentPage).toBe(1);
    });
  });

  describe("GET /posts/:id", () => {
    it("Should return a specific post by ID", async () => {
      const mockPost = {
        _id: postId,
        title: "Test Post",
        message: "Test Message",
      };

      postService.getPostById.mockResolvedValue(mockPost);

      const res = await request(app).get(`/posts/${postId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(postId);
      expect(res.body.title).toBe("Test Post");
    });

    it("Should return 400 for an invalid ID", async () => {
      postService.getPostById.mockRejectedValue(new Error("Invalid post ID"));

      const res = await request(app).get(`/posts/${null}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid post ID");
    });
  });

  describe("POST /posts", () => {
    it("Should create a new post", async () => {
      const newPost = { title: "New Post", message: "New Post Message" };
      const mockPost = { ...newPost, _id: postId, creator: "mockedUserId" };

      postService.createPost.mockResolvedValue(mockPost);

      const res = await request(app)
        .post("/posts")
        .set("Authorization", "Bearer mockToken")
        .send(newPost);

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe("New Post");
      expect(res.body.creator).toBe("mockedUserId");
    });
  });

  describe("PATCH /posts/:id", () => {
    it("Should update a post", async () => {
      const updatedPost = { title: "Updated Post" };

      postService.updatePost.mockResolvedValue({
        ...updatedPost,
        _id: postId,
        message: "Updated Post Message",
      });

      const res = await request(app)
        .patch(`/posts/${postId}`)
        .set("Authorization", "Bearer mockToken")
        .send(updatedPost);

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe("Updated Post");
    });
  });

  describe("GET /posts/:id", () => {
    it("Should return a specific post by ID", async () => {
      const mockPost = {
        _id: postId,
        title: "Test Post",
        message: "Test Message",
      };

      postService.getPostById.mockResolvedValue(mockPost);

      const res = await request(app).get(`/posts/${postId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(postId);
      expect(res.body.title).toBe("Test Post");
    });

    it("Should return 404 for an invalid ID", async () => {
      postService.getPostById.mockResolvedValue(null);

      const res = await request(app).get(`/posts/${postId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Post not found");
    });
  });

  describe("PATCH /posts/:id/likePost", () => {
    it("Should like a post", async () => {
      const mockPost = { _id: postId, likes: ["mockedUserId"] };

      postService.likePost.mockResolvedValue(mockPost);

      const res = await request(app)
        .patch(`/posts/${postId}/likePost`)
        .set("Authorization", "Bearer mockToken");

      expect(res.statusCode).toBe(200);
      expect(res.body.likes).toContain("mockedUserId");
    });
  });

  describe("POST /posts/:id/commentPost", () => {
    it("Should add a comment to a post", async () => {
      const comment = "This is a test comment";
      const mockPost = { _id: postId, comments: [comment] };

      postService.commentOnPost.mockResolvedValue(mockPost);

      const res = await request(app)
        .post(`/posts/${postId}/commentPost`)
        .set("Authorization", "Bearer mockToken")
        .send({ value: comment });

      expect(res.statusCode).toBe(200);
      expect(res.body.comments).toContain(comment);
    });
  });
});
