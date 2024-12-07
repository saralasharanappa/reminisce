import mongoose from "mongoose";

// const userSchema = mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true},
//     password: { type: String, required: true},
//     id: {type: String },
// })

// export default mongoose.model("User", userSchema);
// const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" }, // Base64 or image URL
    bio: { type: String, default: "Write something about yourself!" },
    contact: { type: String, default: "" }, // Optional contact details
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
