import React, { useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip 
} from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const DataProcessor = () => {
  const [inputValue, setInputValue] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [result, setResult] = useState(null);
  const [options, setOptions] = useState([]);
  
  const apiEndpoint = 'http://localhost:3000/bfhl/bajaj';
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrMsg('');
    setResult(null);
    
    let parsedData;
    try {
      parsedData = JSON.parse(inputValue);
    } catch (error) {
      setErrMsg('The provided input is not valid JSON.');
      return;
    }
    
    if (!parsedData.data || !Array.isArray(parsedData.data)) {
      setErrMsg("The JSON should include a 'data' array.");
      return;
    }
    
    try {
      const response = await axios.post(apiEndpoint, parsedData, {
        headers: { 'Content-Type': 'application/json' }
      });
      const responseData = response.data;
      setResult(responseData);
      if (responseData.roll_number) {
        document.title = responseData.roll_number;
      }
    } catch (error) {
      setErrMsg(`API Error: ${error.message}`);
    }
  };
  
  const handleSelectChange = (event) => {
    const value = event.target.value;
    setOptions(typeof value === 'string' ? value.split(',') : value);
  };
  
  const renderFilteredResult = () => {
    if (!result) return null;
    const filtered = {};
    if (options.includes('Numbers')) {
      filtered.numbers = result.numbers;
    }
    if (options.includes('Alphabets')) {
      filtered.alphabets = result.alphabets;
    }
    if (options.includes('Highest Alphabet')) {
      filtered.highest_alphabet = result.highest_alphabet;
    }
    
    return (
      <Card variant="outlined" sx={{ mt: 3, backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>API Response</Typography>
          <pre style={{ backgroundColor: '#ececec', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(filtered, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <Box sx={{ p: 3, backgroundColor: '#f0f4c3', minHeight: '100vh' }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', color: '#558b2f' }}>
                Data Processor
              </Typography>
              <Box component="form" onSubmit={handleFormSubmit}>
                <TextField
                  label="Enter JSON Data"
                  multiline
                  rows={5}
                  fullWidth
                  variant="outlined"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder='e.g. { "data": ["A", "C", "z"] }'
                  sx={{ mb: 2, backgroundColor: '#fafafa', borderRadius: '4px' }}
                />
                {errMsg && (
                  <Typography color="error" sx={{ mb: 2 }}>
                    {errMsg}
                  </Typography>
                )}
                <Button 
                  variant="contained" 
                  color="success" 
                  type="submit" 
                  fullWidth 
                  sx={{ py: 1.5, mb: 2, backgroundColor: '#558b2f', '&:hover': { backgroundColor: '#33691e' } }}
                >
                  Process Data
                </Button>
              </Box>
              {result && (
                <>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel sx={{ color: '#558b2f' }}>Choose Fields</InputLabel>
                    <Select
                      multiple
                      value={options}
                      onChange={handleSelectChange}
                      label="Choose Fields"
                      MenuProps={selectMenuProps}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((option) => (
                            <Chip key={option} label={option} sx={{ backgroundColor: '#558b2f', color: 'white' }} />
                          ))}
                        </Box>
                      )}
                    >
                      <MenuItem value="Numbers">Numbers</MenuItem>
                      <MenuItem value="Alphabets">Alphabets</MenuItem>
                      <MenuItem value="Highest Alphabet">Highest Alphabet</MenuItem>
                    </Select>
                  </FormControl>
                  {renderFilteredResult()}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DataProcessor;
