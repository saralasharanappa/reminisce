// services/authService.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.js";

const JWT_SECRET = "test";

// sigup service 
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


//   sigin service
export const signin = async (email, password) => {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new Error("User doesn't exist.");
    }
  
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      throw new Error("Invalid Credentials.");
    }
  
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
  
    return { result: existingUser, token };
  };
  