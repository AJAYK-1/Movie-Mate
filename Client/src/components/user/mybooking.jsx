import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

export default function Mybooking() {
  const [ticket, setTicket] = useState([]);
  const token = jwtDecode(localStorage.getItem('token'));

  useEffect(() => {
    axios
      .get("http://localhost:9000/user/mybooking", {
        headers: { id: token.user._id }
      })
      .then((res) => {
        console.log(res.data);
        setTicket(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Function to format date (DD-MM-YYYY)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  };



  // Function to format show time based on category
  const getFormattedTime = (showTime) => {
    switch (showTime) {
      case "Morning Show":
        return "Morning Show 10:00 AM";
      case "Afternoon Show":
        return "Afternoon Show 2:00 PM";
      case "Evening Show":
        return "Evening Show 6:00 PM";
      default:
        return showTime; // If other time formats exist
    }
  };

  const tickets=ticket.filter((tick)=>tick.paymentStatus=="Completed")
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        My Bookings
      </Typography>

      {tickets.length > 0 ? (
        <Grid container spacing={3}>
          {tickets.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ border: "1px solid #d32f2f", borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    {item.movieName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Show Date:</strong> {formatDate(item.date)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Show Time:</strong> {getFormattedTime(item.time)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Seats:</strong> {item.seats.join(', ')}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Total Price:</strong> ₹{item.totalPrice}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Booking ID: {item._id}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" align="center" color="textSecondary" sx={{ mt: 4 }}>
          No bookings found.
        </Typography>
      )}
    </Box>
  );
}
