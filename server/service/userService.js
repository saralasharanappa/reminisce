// services/authService.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.js";

const JWT_SECRET = "test";


export const signup = async (email, password, firstName, lastName) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists.");
    }
  
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    };
  
    const result = await User.create(newUser);
    const token = jwt.sign({ email: result.email, id: result._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
  
    return { result, token };
  };
  