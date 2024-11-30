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
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Icon from "./icon";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signin, signup } from "../../actions/auth";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Auth = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const handleShowPassword = () =>
    setShowPassword((prevShowPassword) => !prevShowPassword);
  const switchMode = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
    setShowPassword(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      dispatch(signup(formData, history));
    } else {
      dispatch(signin(formData, history));
    }
  };
  const onSuccess = (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;
    try {
      dispatch({ type: "AUTH", data: { result, token } });
      history("/");
    } catch (error) {
      console.log(error);
    }
  };
  const onError = (error) => {
    console.log("Google sign in failed! Try again later.", error);
  };

  return (
    <GoogleOAuthProvider clientId="">
      <Container component="main" maxWidth="xs">
        <Paper className="p-4" elevation={3}>
          <Avatar className="mx-auto bg-blue-500">
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" className="text-center my-3">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Typography>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Grid container spacing={2}>
              {isSignUp && (
                <>
                  <Input
                    name="firstName"
                    label="First Name"
                    handleChange={handleChange}
                    autoFocus
                    half
                  />
                  <Input
                    name="lastName"
                    label="Last Name"
                    handleChange={handleChange}
                    half
                  />
                </>
              )}
              <Input
                name="email"
                label="Email Address"
                handleChange={handleChange}
                type="email"
              />
              <Input
                name="password"
                label="Password"
                handleChange={handleChange}
                type={showPassword ? "text" : "password"}
                handleShowPassword={handleShowPassword}
              />
              {isSignUp && (
                <Input
                  name="confirmPassword"
                  label="Repeat Password"
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
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
            {/* <GoogleLogin
              render={(renderProps) => (
                <Button
                  className="mt-3 w-full"
                  color="primary"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  startIcon={<Icon />}
                  variant="contained"
                >
                  Google Sign In
                </Button>
              )}
              onSuccess={onSuccess}
              onError={onError}
              cookiePolicy="single_host_origin"
            /> */}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button onClick={switchMode} className="text-sm mt-2">
                  {isSignUp
                    ? "Already have an account? Sign In"
                    : "Don't have an account? Sign Up"}
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
