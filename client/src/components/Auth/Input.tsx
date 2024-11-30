import React from "react";
import { TextField, Grid, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Define the props interface
interface InputProps {
  name: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  half?: boolean;
  autoFocus?: boolean;
  type?: string;
  handleShowPassword?: () => void;
}

const Input: React.FC<InputProps> = ({
  name,
  handleChange,
  label,
  half = false,
  autoFocus = false,
  type = "text",
  handleShowPassword,
}) => (
  <Grid item xs={12} sm={half ? 6 : 12}>
    <TextField
      name={name}
      onChange={handleChange}
      variant="outlined"
      required
      fullWidth
      label={label}
      autoFocus={autoFocus}
      type={type}
      InputProps={{
        endAdornment:
          name === "password" && handleShowPassword ? (
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  type === "password"
                    ? "Toggle password visibility"
                    : "Toggle password visibility off"
                }
                onClick={handleShowPassword}
              >
                {type === "password" ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ) : null,
      }}
    />
  </Grid>
);

export default Input;
