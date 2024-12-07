import React, { useState } from "react";
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Input from "./Input";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signin, signup } from "../../actions/auth";
import { AppDispatch } from "../../types/store";
import { useTranslation } from "react-i18next";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Auth = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const history = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleShowPassword = () =>
    setShowPassword((prevShowPassword) => !prevShowPassword);
  const switchMode = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
    setShowPassword(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
console.log(errors, isLoading)
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (isSignUp) {
      // First Name validation
      if (!formData.firstName) {
        newErrors.firstName = "First name is required";
        isValid = false;
      }

      // Last Name validation
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required";
        isValid = false;
      }

      // Confirm Password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await dispatch(signup(formData, () => {
          history("/posts");
          window.dispatchEvent(new Event("storage"));
        }));
      } else {
        await dispatch(signin(formData, () => {
          history("/posts");
          window.dispatchEvent(new Event("storage"));
        }));
      }
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // const onSuccess = (res) => {
  //   const result = res?.profileObj;
  //   const token = res?.tokenId;
  //   try {
  //     dispatch({ type: "AUTH", data: { result, token } });
  //     history("/");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const onError = (error) => {
  //   console.log("Google sign in failed! Try again later.", error);
  // };

  return (
    <GoogleOAuthProvider clientId="">
      <Container component="main" maxWidth="xs">
        <Paper className="p-4" elevation={3}>
          <Avatar className="mx-auto bg-blue-500">
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" className="text-center my-3">
            {isSignUp ? t("auth.signUp") : t("auth.signIn")}
          </Typography>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Grid container spacing={2}>
              {isSignUp && (
                <>
                  <Input
                    name="firstName"
                    label={t("auth.firstName")}
                    handleChange={handleChange}
                    autoFocus
                    half
                  />
                  <Input
                    name="lastName"
                    label={t("auth.lastName")}
                    handleChange={handleChange}
                    half
                  />
                </>
              )}
              <Input
                name="email"
                label={t("auth.email")}
                handleChange={handleChange}
                type="email"
              />
              <Input
                name="password"
                label={t("auth.password")}
                handleChange={handleChange}
                type={showPassword ? "text" : "password"}
                handleShowPassword={handleShowPassword}
              />
              {isSignUp && (
                <Input
                  name="confirmPassword"
                  label={t("auth.confirmPassword")}
                  handleChange={handleChange}
                  type="password"
                />
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="mt-3"
            >
              {isSignUp ? t("auth.submitSignUp") : t("auth.submitSignIn")}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button onClick={switchMode} className="text-sm mt-2">
                  {isSignUp
                    ? t("auth.alreadyHaveAccount")
                    : t("auth.dontHaveAccount")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </GoogleOAuthProvider>
  );
};

export default Auth;
