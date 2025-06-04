import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import {
  Box, Drawer, List, ListItemButton, ListItemText,
  AppBar, Toolbar, Typography, CssBaseline
} from "@mui/material";
import ViewMovies from "./viewcinema";
import ViewArtists from "./viewartist";
import AddMovieForm from "./addmovie";
import AddArtistForm from "./addartist";
import Viewtheaters from "./viewthaeters";
import Viewusers from "./viewusers";
import ViewReviews from "./viewreview";

const drawerWidth = 240;

const AdminDashboard = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#121212", // Black sidebar
            color: "white",
            position: "fixed", // Fixes sidebar position
          },
        }}
      > <Typography variant="h6" noWrap sx={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
          Movie Mate
        </Typography>
        <List sx={{ mt: 2 }}>
          {[
            { text: "View Movies", path: "/admin/view-movies" },
            { text: "View Artists", path: "/admin/view-artists" },
            { text: "Add Movie", path: "/admin/add-movie-form" },
            { text: "Add Artist", path: "/admin/add-artist-form" },
            { text: "View Theaters", path: "/admin/view-theaters" },
            { text: "View Users", path: "/admin/view-users" },
            { text: "View Reviews", path: "/admin/view-review" },
            { text: "Logout", path: "/" },
          ].map((item, index) => (
            <ListItemButton
              key={index}
              component={Link}
              to={item.path}
              sx={{
                "&:hover": { bgcolor: "#ff0000", color: "white" }, // Red hover effect
              }}
            >
              <ListItemText primary={item.text} sx={{ textAlign: "center" }} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "white",
          p: 3,
          ml: `15px`,
        }}
      >
        <AppBar position="sticky" sx={{ bgcolor: "#ff0000" }}>
          <Toolbar>
            <Typography variant="h6" noWrap sx={{ color: "white", fontWeight: "bold" }}>
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Routes */}
        <Box sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<ViewMovies />} />
            <Route path="/view-movies" element={<ViewMovies />} />
            <Route path="/view-artists" element={<ViewArtists />} />
            <Route path="/add-movie-form" element={<AddMovieForm />} />
            <Route path="/add-artist-form" element={<AddArtistForm />} />
            <Route path="/view-theaters" element={<Viewtheaters />} />
            <Route path="/view-users" element={<Viewusers />} />
            <Route path="/view-review" element={<ViewReviews />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
