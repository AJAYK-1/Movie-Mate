import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Theaterhome() {
    const navigate = useNavigate();
    const token = jwtDecode(localStorage.getItem('token'));
    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token
        navigate('/'); // Redirect to login page
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

            {/* Welcome Message */}
            <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h4">
                    Welcome, {token.theater.name}
                </Typography>
            </Box>
        </>
    );
}
