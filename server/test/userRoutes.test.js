import request from "supertest";
import app from "../index.js";
import * as authService from "../service/userService.js"; // Mocking the service layer

jest.mock("../service/userService.js"); // Mock the entire service layer

describe("Auth APIs", () => {
  describe("POST /user/signup", () => {
    it("Should register a new user and return 201", async () => {
      // Mock service response
      const mockResponse = {
        result: { email: "test@example.com", name: "Test User" },
        token: "mocked_token",
      };
      authService.signup.mockResolvedValue(mockResponse);

      const user = {
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
      };

      const res = await request(app).post("/user/signup").send(user);

      expect(res.statusCode).toBe(201);
      expect(res.body.result.email).toBe(user.email);
      expect(res.body.token).toBe(mockResponse.token);
    });

    it("Should return 400 if user already exists", async () => {
      // Mock service throwing an error
      authService.signup.mockRejectedValue(new Error("User already exists."));

      const user = {
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
      };

      const res = await request(app).post("/user/signup").send(user);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("User already exists.");
    });
  });

  describe("POST /user/signin", () => {
    it("Should login a user and return 200", async () => {
      // Mock service response
      const mockResponse = {
        result: { email: "test@example.com", name: "Test User" },
        token: "mocked_token",
      };
      authService.signin.mockResolvedValue(mockResponse);

      const user = {
        email: "test@example.com",
        password: "password123",
      };

      const res = await request(app).post("/user/signin").send(user);

      expect(res.statusCode).toBe(200);
      expect(res.body.result.email).toBe(user.email);
      expect(res.body.token).toBe(mockResponse.token);
    });

    it("Should return 404 if user does not exist", async () => {
      // Mock service throwing an error
      authService.signin.mockRejectedValue(new Error("User doesn't exist."));

      const user = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      const res = await request(app).post("/user/signin").send(user);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("User doesn't exist.");
    });

    it("Should return 404 if credentials are invalid", async () => {
      // Mock service throwing an error
      authService.signin.mockRejectedValue(new Error("Invalid Credentials."));

      const user = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const res = await request(app).post("/user/signin").send(user);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Invalid Credentials.");
    });
  });
});
