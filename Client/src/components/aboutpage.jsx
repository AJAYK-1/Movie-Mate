import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: "black" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ color: "red" }}>Movie Mate</Typography>
          <Typography variant="body1" sx={{ cursor: "pointer", color: "white" }} onClick={() => navigate('/')}>Home</Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "red", mb: 2 }}>
          About Movie Mate
        </Typography>
        <Typography variant="body1" sx={{ color: "black", maxWidth: "800px", margin: "0 auto", lineHeight: 1.6 }}>
          Welcome to Movie Mate, your ultimate destination for discovering, reviewing, and enjoying the best movies from around the world. Whether you're a fan of Hollywood blockbusters, Bollywood hits, or indie gems, we have something for every movie enthusiast.
        </Typography>
        <Typography variant="body1" sx={{ color: "black", maxWidth: "800px", margin: "20px auto", lineHeight: 1.6 }}>
          Our platform offers personalized recommendations based on your mood, advanced search filters, and an engaging community where you can share your thoughts and reviews. Movie Mate is designed to make your movie-watching experience seamless and enjoyable.
        </Typography>
        <Typography variant="body1" sx={{ color: "black", maxWidth: "800px", margin: "0 auto", lineHeight: 1.6 }}>
          Stay updated with the latest movie trends, ratings, and reviews. Join us on this cinematic journey and never miss out on an amazing movie again!
        </Typography>
      </Container>

      <Box component="footer" sx={{ backgroundColor: "black", color: "white", textAlign: "center", py: 3, mt: 4 }}>
        <Typography variant="h6">Movie Mate</Typography>
        <Typography variant="body2">Bringing movies closer to you.</Typography>
        <Typography variant="body2">© {new Date().getFullYear()} Movie Mate. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default AboutPage;
