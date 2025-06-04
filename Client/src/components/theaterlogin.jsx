import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, Grid, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TheaterLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otp, setOtp] = useState("");  // OTP from backend
  const [otpEntered, setOtpEntered] = useState("");  // OTP entered by user
  const [newPassword, setNewPassword] = useState("");  // New password
  const [confirmPassword, setConfirmPassword] = useState("");  // Confirm new password
  const [passwordUpdated, setPasswordUpdated] = useState(false);  // Success flag
  const [passwordReset, setPasswordReset] = useState(false);  // OTP verified flag

  // Handle input change for login and password reset
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtpEntered(e.target.value);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const validate = () => {
    return formData.email && formData.password;
  };

  // Handle form submission for login
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      axios.post("http://localhost:9000/theater/theaterlogin", formData)
        .then((res) => {
          alert(res.data.msg);
          if (res.data.status === 200) {
            navigate('/theaterhome');
            localStorage.setItem("token", res.data.token);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  // Handle "Forgot Password" link click
  const handleForgotPassword = () => {
    setForgotPassword(true);
  };

  // Handle password reset request
  const handleResetPassword = (e) => {
    e.preventDefault();
    console.log(formData.email)
    axios.post("http://localhost:9000/theater/forgot-password", { email: formData.email })
      .then((res) => {
        alert(res.data.msg);
        setOtp(res.data.otp);
        setPasswordReset(true);  
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Verify OTP entered by the user
  const verifyOtp = () => {
    if (otpEntered === otp) {
      alert("OTP Verified successfully. You can now reset your password.");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  // Handle password update
  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    axios.put("http://localhost:9000/theater/update-password", {
      email: formData.email,
      otp: otpEntered,
      newPassword: newPassword,
    })
      .then((res) => {
        alert(res.data.msg);
        setPasswordUpdated(true); 
        navigate("/theaterlogin");
      })
      .catch((err) => {
        console.log(err);
        alert("Error occurred while updating the password.");
      });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: "background.paper" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Theater Login
        </Typography>

        {!forgotPassword ? (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Login
            </Button>

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid item>
                <Button onClick={() => navigate("/register-theater")} color="secondary">
                  Don't have an account? Sign Up
                </Button>
              </Grid>
            </Grid>

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid item>
                <Link href="#" variant="body2" onClick={handleForgotPassword}>
                  Forgot Password?
                </Link>
              </Grid>
            </Grid>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <TextField
              fullWidth
              label="Enter your email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Reset Password
            </Button>
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid item>
                <Link href="#" variant="body2" onClick={() => setForgotPassword(false)}>
                  Back to Login
                </Link>
              </Grid>
            </Grid>
          </form>
        )}

        {passwordReset && !passwordUpdated && (
          <form onSubmit={handlePasswordUpdate}>
            <TextField
              fullWidth
              label="Enter OTP"
              value={otpEntered}
              onChange={handleOtpChange}
              margin="normal"
            />
            <Button type="button" variant="contained" color="primary" onClick={verifyOtp}>
              Verify OTP
            </Button>

            {otpEntered === otp && (
              <>
                <TextField
                  fullWidth
                  label="Enter New Password"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={handlePasswordChange}
                  margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                  Update Password
                </Button>
              </>
            )}
          </form>
        )}
      </Box>
    </Container>
  );
}

export default TheaterLogin;
