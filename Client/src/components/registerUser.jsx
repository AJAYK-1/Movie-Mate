import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserRegister = () => {
  // State for name, email, OTP, error/success messages
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

//   navigation
const navigate=useNavigate()
  // Handle sending OTP for registration
  const handleSendOtp = async () => {
    if (!name || !email) {
      setErrorMessage('Please enter both name and email.');
      return;
    }

    try {
      // Send a request to the backend to generate and send OTP
      const response = await axios.post('http://localhost:9000/user/login', { name, email });
      if (response.status === 200) {
        setIsOtpSent(true);
        setSuccessMessage('OTP sent successfully to your email!');
        setErrorMessage('');
      }
    } catch (error) {
      setErrorMessage('Error sending OTP, please try again.');
      setSuccessMessage('');
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrorMessage('Please enter the OTP.');
      return;
    }

    try {
      console.log(email, otp )
      const response = await axios.post('http://localhost:9000/user/verify', { email, otp });
      if (response.status === 200) {
        setSuccessMessage(response.data.message);
        localStorage.setItem("email",email)
        localStorage.setItem("token",response.data.token)
        navigate('/user/userhome')
        setErrorMessage('');
      }
    } catch (error) {
      setErrorMessage('Invalid OTP, please try again.',error);
      setSuccessMessage('');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 3, boxShadow: 2 }}>
      <Typography variant="h4" noWrap sx={{ color: " rgb(4, 48, 47)", fontWeight: "bold", textAlign: "center" }}>
              User Registration/Login
            </Typography>

      {/* Show error or success message */}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      {/* Name Input */}
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Email Input */}
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Send OTP Button */}
      {!isOtpSent ? (
        <Button variant="contained" color="primary" fullWidth onClick={handleSendOtp}>
          Send OTP
        </Button>
      ) : (
        <>
          {/* OTP Input */}
          <TextField
            label="OTP"
            variant="outlined"
            fullWidth
            margin="normal"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {/* Verify OTP Button */}
          <Button variant="contained" color="secondary" fullWidth onClick={handleVerifyOtp}>
            Verify OTP
          </Button>
        </>
      )}
    </Box>
  );
};

export default UserRegister;
