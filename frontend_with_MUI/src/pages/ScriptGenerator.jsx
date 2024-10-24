import React, { useContext, useState } from "react";
import { Context, server } from "../main";
import { Navigate } from "react-router-dom";
import CSVUpload from "../components/CSVUpload";
import { Tabs, Tab, Box, Typography, Container, Paper, Grid } from "@mui/material";

const ScriptGenerator = () => {
  const { isAuthenticated } = useContext(Context);
  const [activeTab, setActiveTab] = useState(0);

  if (!isAuthenticated) return <Navigate to="/login" />;

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container component="main" sx={{ mt: 4 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} textAlign="center">
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Script Generator
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Upload a CSV and generate scripts in JMX, Scala, or K6 format scripts.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="CSV Upload" />
              </Tabs>
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ mt: 3 }}>
            {activeTab === 0 && <CSVUpload />}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ScriptGenerator;
