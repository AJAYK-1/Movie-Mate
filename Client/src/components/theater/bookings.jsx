import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Box, AppBar, Toolbar, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Bookings() {
  const navigate = useNavigate();
  const storedToken = localStorage.getItem('token');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!storedToken) {
    navigate('/theaterlogin');
    return null;
  }

  const token = jwtDecode(storedToken);

  useEffect(() => {
    axios.get("http://localhost:9000/theater/view-booking", {
      headers: { id: token.theater._id }
    })
    .then((res) => {
      setBookings(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.log("Error fetching bookings:", err);
      setError("Failed to load bookings");
      setLoading(false);
    });
  }, [token.theater._id]); // Add dependency

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      {/* Navbar */}
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

      {/* Bookings Table */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          View Bookings
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : bookings.length === 0 ? (
          <Typography>No bookings available.</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f50057" }}>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>Movie Name</TableCell>
                  <TableCell sx={{ color: "white" }}>Customer</TableCell>
                  <TableCell sx={{ color: "white" }}>Seats</TableCell>
                  <TableCell sx={{ color: "white" }}>Show Time</TableCell>
                  <TableCell sx={{ color: "white" }}>Date</TableCell>
                  <TableCell sx={{ color: "white" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking, index) => (
                  <TableRow key={index}>
                    <TableCell>{booking.movieId.movieName}</TableCell>
                    <TableCell>{booking.userId.name}</TableCell>
                    <TableCell>{booking.seats.join(", ")}</TableCell>
                    <TableCell>{booking.time}</TableCell>
                    <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                    <TableCell>{booking.paymentStatus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
}
