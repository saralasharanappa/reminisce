// controllers/auth.js

import * as authService from "../service/userService.js";

// Controller for siginup
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

//   controller for signin
export const signin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const { result, token } = await authService.signin(email, password);
      res.status(200).json({ result, token });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };