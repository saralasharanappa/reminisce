import express from "express";
import { signin, signup } from "../controllers/userControllers.js";
import auth from "../middleware/auth.js";
import multer from "multer";
import users from "../models/users.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// signup route
router.post("/signup", signup);
// sigin route
router.post("/signin", signin);

// Fetch user profile by ID
router.get("/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await users.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// Update user profile by ID
// Route to update user profile
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { name, bio, contact, profilePicture } = req.body;

  const updatedProfileData = {
    name,
    bio,
    contact,
    profilePicture,
  };

  try {
    const updatedUser = await users.findByIdAndUpdate(id, updatedProfileData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error });
  }
});

export default router;
