import React, { useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, CircularProgress, Box, IconButton } from '@mui/material';
import Logo from '../public/JioLogo.png';
import { Context, server } from '../main';

const Header = () => {
  const { isAuthenticated, setIsAuthenticated, loading, setLoading } = useContext(Context);

  const logoutHandler = async () => {
    setLoading(true);
  
    try {
      const response = await axios.get(`${server}/users/logout`, {
        withCredentials: true,  // Ensures cookies are sent with the request
      });
  
      toast.success(response.data.message);
      
      // Remove token from local storage
      localStorage.removeItem("token");
      
      // Update the authentication state
      setIsAuthenticated(false);
    } catch (error) {
      let errorMessage = 'An error occurred';
      if (error.response) {
        errorMessage = error.response.data.message || `Server responded with status ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response received from the server';
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <img src={Logo} alt="JIO Logo" style={{ height: '40px' }} /> {/* Adjust size as needed */}
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          API Scripter
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          {isAuthenticated ? (
            <Button color="inherit" onClick={logoutHandler} disabled={loading}>
              {loading ? <CircularProgress color="inherit" size={24} /> : 'Logout'}
            </Button>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
