import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Typography, Paper, CircularProgress, AppBar, Toolbar, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';

export default function Profile() {
  const navigate = useNavigate();
  const storedToken = localStorage.getItem('token');

  if (!storedToken) {
    navigate('/theaterlogin');
    return null;
  }

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = jwtDecode(storedToken);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    license: '',
    place: ''
  });

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:9000/theater/viewProfile", {
      headers: { id: token.theater._id }
    })
      .then((res) => {
        setProfile(res.data);
        setFormData({
          name: res.data.name,
          email: res.data.email,
          license: res.data.license,
          place: res.data.place
        });
        setLoading(false);
      })
      .catch(err => {
        console.log("Error fetching profile:", err);
        setError("Failed to load profile");
        setLoading(false);
      });
  }, [token.theater._id]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.put("http://localhost:9000/theater/updateProfile", formData, {
      headers: { id: token.theater._id }
    })
      .then((res) => {
        setProfile(res.data);
        setSuccess("Profile updated successfully!");
        setOpenDialog(false);
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        setError("Failed to update profile");
      });
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  if (loading) return <CircularProgress sx={{ mt: 3, mx: "auto", display: "block" }} />;
  if (error) return <Typography color="error" sx={{ mt: 3, textAlign: "center" }}>{error}</Typography>;

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "black" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ color: "red" }}>
            Theater Dashboard
          </Typography>
          <Box>
            <Button sx={{ color: "white", backgroundColor: "red", mx: 1 }} onClick={() => navigate('/theaterhome/profile')}>
              Profile
            </Button>
            <Button sx={{ color: "white", backgroundColor: "red", mx: 1 }} onClick={() => navigate('/theaterhome/bookings')}>
              Bookings
            </Button>
            <Button sx={{ color: "white", backgroundColor: "red", mx: 1 }} onClick={() => navigate('/theaterhome/addmovies')}>
              Movies
            </Button>
            <Button sx={{ color: "white", backgroundColor: "red", mx: 1 }} onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Information */}
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, maxWidth: 400, mx: "auto", backgroundColor: "#f8f9fa" }}>
          <Typography variant="h4" gutterBottom>Profile</Typography>
          <Typography variant="h6"><strong>Theater Name:</strong> {profile.name}</Typography>
          <Typography variant="h6"><strong>Email:</strong> {profile.email}</Typography>
          <Typography variant="h6"><strong>License:</strong> {profile.license}</Typography>
          <Typography variant="h6"><strong>Location:</strong> {profile.place}</Typography>
          <Typography variant="h6"><strong>Last Updated:</strong> {new Date(profile.updatedAt).toLocaleString()}</Typography>


          {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

          <Button variant="contained" sx={{ backgroundColor: "red", mt: 2 }} onClick={handleOpenDialog}>
            Edit Profile
          </Button>
        </Paper>
      </Box>

      {/* Dialog for Profile Update */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Theater Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="License"
              name="license"
              value={formData.license}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Location"
              name="place"
              value={formData.place}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}