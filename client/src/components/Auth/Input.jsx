import React from "react";
import { TextField, Grid, InputAdornment, IconButton } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Input = ({
  name,
  handleChange,
  label,
  half,
  autoFocus,
  type,
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
      className="input input-bordered w-full"
      InputProps={{
        endAdornment: name === 'password' && (
          <InputAdornment position="end">
            <IconButton
              aria-label={type === "password" ? "Toggle password visibility" : "Toggle password visibility off"}
              onClick={handleShowPassword}
            >
              {type === "password" ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
        classes: { root: "input input-bordered w-full" } // Tailwind classes can be applied directly if necessary, but in this case, we want to keep MUI functionality.
      }}
    />
  </Grid>
);

export default Input;
