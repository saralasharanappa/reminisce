// controllers/auth.js

import * as authService from "../service/userService.js";

export const signup = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
  
    try {
      const { result, token } = await authService.signup(
        email,
        password,
        firstName,
        lastName
      );
      res.status(201).json({ result, token });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };