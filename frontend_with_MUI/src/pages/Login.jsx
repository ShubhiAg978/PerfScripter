import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import { Context, server } from "../main";
import { Button, TextField, CircularProgress, Container, Typography, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated, loading, setLoading } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/users/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
    } catch (error) {
      let errorMessage = "An error occurred";
      if (error.response) {
        errorMessage = error.response.data.message || "Server error";
      } else if (error.request) {
        errorMessage = "No response received from the server";
      }
      toast.error(errorMessage);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          <Box textAlign="center">
            <Typography variant="body2">
               Don't have an account?{' '}
              <RouterLink to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
                Sign Up
              </RouterLink>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
