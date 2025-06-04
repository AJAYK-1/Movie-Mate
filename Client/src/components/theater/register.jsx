import React, { useState } from "react";
import { TextField, Button, Container, Typography, Grid } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterTheater() {
  const [formData, setFormData] = useState({
    name: "",
    license: "",
    email: "",
    place: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:9000/theater/register", formData);
      setSuccess(response.data.message);
      setFormData({ name: "", license: "", email: "", place: "", password: "" });
      if (response.status == 201) {
        navigate("/theaterlogin")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" noWrap sx={{ color: " rgb(4, 48, 47)", fontWeight: "bold", textAlign: "center" }}>
        Theater Registration
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Theater Name" name="name" fullWidth required value={formData.name} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="License Number" name="license" fullWidth required value={formData.license} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" name="email" type="email" fullWidth required value={formData.email} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Location/Place" name="place" fullWidth required value={formData.place} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Password" name="password" type="password" fullWidth required value={formData.password} onChange={handleChange} />
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Typography color="error">{error}</Typography>
            </Grid>
          )}
          {success && (
            <Grid item xs={12}>
              <Typography color="primary">{success}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register Theater
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
