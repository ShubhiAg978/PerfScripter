import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { server } from '../main';
import FileSaver from 'file-saver';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography, Box, CircularProgress } from '@mui/material';

const CSVUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const saveToFiles = (contents, fileNames) => {
    contents.forEach((content, index) => {
      const blob = new Blob([content], { type: "text/xml;charset=utf-8" });
      FileSaver.saveAs(blob, fileNames[index]);
    });
  };

  const saveToFile = (content, fileName) => {
    const blob = new Blob([content], { type: "text/xml;charset=utf-8" });
    FileSaver.saveAs(blob, fileName);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const auth_token = localStorage.getItem('token');
      const headers = {
        "Content-Type": "multipart/form-data",
        "Authorization": `${auth_token}`,
      };

      const response = await axios.post(`${server}/script/${selectedOption.toLowerCase()}upload`, formData, { headers, withCredentials: true });
      const { data } = response;

      if (data.success) {
        // Handle different script types
        if (selectedOption === "JMX") {
          saveToFile(data.jmxScript, "JMeterScript.jmx");
        } else if (selectedOption === "Scala") {
          const fileNames = data.scalaScripts.map((_, index) => `GeneratedScript_${index + 1}.scala`);
          saveToFiles(data.scalaScripts, fileNames);
        } else if (selectedOption === "K6") {
          saveToFile(data.k6Script, "K6Script.js");
        }
        toast.success(`${selectedOption} script generated and saved successfully`);
      } else {
        toast.error(data.message || "Error generating script");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error generating script");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f0f2f5",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <input
        type="file"
        onChange={handleFileChange}
        accept=".csv"
        style={{ marginBottom: "20px", display: "block" }}
      />

      <FormControl fullWidth style={{ paddingBottom: "10px", marginBottom: "20px" }}>
          <InputLabel>Select an option</InputLabel>
          <Select
            value={selectedOption}
            label="Select an option"
            onChange={(e) => setSelectedOption(e.target.value)}
            sx={{ backgroundColor: '#fff', textAlign: 'left' }}
          >
            <MenuItem value="JMX">JMX</MenuItem>
            <MenuItem value="Scala">Scala</MenuItem>
            <MenuItem value="K6">K6</MenuItem>
          </Select>
        </FormControl>

      <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || !selectedOption || loading}
          sx={{ backgroundColor: '#1976d2', color: '#fff', fontWeight: 'small' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Download Script'}
        </Button>
    </div>
  );
};

export default CSVUpload;


