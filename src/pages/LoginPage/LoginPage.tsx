import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

// Mock users for local authentication
const MOCK_USERS = [
  {
    email: "omgaikwad645@gmail.com",
    password: "password123",
    name: "Om Gaikwad",
  },
];

interface LoginProps {
  onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Find user with matching credentials
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Generate a mock token
      const token = btoa(JSON.stringify(user));

      // Store token in cookie
      Cookies.set("authToken", token, { expires: 1 }); // expires in 1 day

      // Redirect to dashboard
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ width: "100%", mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Login Credentials
          </Typography>

          <Alert severity="success">
            Email: omgaikwad645@gmail.com <br /> Password: password123
          </Alert>
        </Box>
      </Paper>
    </Container>
  );
};

// Update authentication check to use local verification
export const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const checkAuth = () => {
      const token = Cookies.get("authToken");

      if (!token) {
        // Redirect to login if no token
        window.location.href = "/login";
        return false;
      }

      try {
        // Attempt to decode the token (just to validate it's a valid token)
        const decoded = JSON.parse(atob(token));
        return !!decoded.email;
      } catch {
        // Invalid token
        Cookies.remove("authToken");
        window.location.href = "/login";
        return false;
      }
    };

    if (!checkAuth()) {
      return null; // Prevent rendering until redirect happens
    }

    return <WrappedComponent {...props} />;
  };
};

export default Login;
