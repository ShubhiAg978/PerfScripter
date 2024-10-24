import React, { useContext, useState } from 'react';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Context, server } from '../main';
import toast from 'react-hot-toast';
import { Button, TextField, Typography, Container, Box, CircularProgress } from '@mui/material';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isAuthenticated, setIsAuthenticated, loading, setLoading } = useContext(Context);

  const submitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${server}/users/new`,
        { name, email, password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      toast.success(data.message);
      setIsAuthenticated(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'An unexpected error occurred');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return <Navigate to="/login" />;

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
          Sign Up
        </Typography>
        <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 3 }}>
          <TextField
            autoComplete="name"
            name="name"
            required
            fullWidth
            id="name"
            label="Name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
          <Box textAlign="center">
            <Typography variant="body2">
              Already registered?{' '}
              <RouterLink to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                Log In
              </RouterLink>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
