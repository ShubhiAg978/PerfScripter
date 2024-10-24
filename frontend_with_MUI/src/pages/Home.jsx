import React, { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Context } from '../main';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { motion } from 'framer-motion';

const Home = () => {
  const { isAuthenticated } = useContext(Context);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  if (!isAuthenticated) return <Navigate to="/login" />;

  // Function to handle when swipe is completed
  const handleDragEnd = (_, info) => {
    if (info.point.x > 200) {  // Adjust threshold as needed
      navigate("/translator");  // Redirect to the translator page
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} textAlign="center">
            <Typography
              variant="h5"
              component="h5"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 2 }}
            >
              Welcome to Script Generator
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
              Swipe the button to open the translator and generate scripts.
            </Typography>
          </Grid>

          {/* Swipe Button */}
          <Grid item xs={12} textAlign="center">
            <Box
              sx={{
                position: 'relative',
                width: '300px',
                height: '50px',
                backgroundColor: '#e0e0e0',
                borderRadius: '25px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center', // Center the button vertically
                margin: '0 auto' // Center the button horizontally
              }}
            >
              <motion.div
                drag="x"
                dragConstraints={{ left: 20, right: 20 }}
                dragElastic={0.05}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                style={{
                  width: '100px',
                  height: '50px',
                  borderRadius: '25px',
                  backgroundColor: '#1976d2',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                whileTap={{ scale: 1.1 }}  // Add a scaling effect on tap
              >
                Swipe
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Home;
