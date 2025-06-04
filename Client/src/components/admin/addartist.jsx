import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";
import AXIOS from 'axios';
import { useNavigate } from "react-router-dom";

const ArtistForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    stagename:"",
    birthPlace: "",
    dob: "",
    firstMovie: "",
    awards: "",
    netWorth: "",
    role: "",
    image: null,
  });
 
  const navigate=useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new FormData object
    const formDataToSend = new FormData();

    // Append all the form data to the FormData object
    formDataToSend.append("name", formData.name);
    formDataToSend.append("birthPlace", formData.birthPlace);
    formDataToSend.append("dob", formData.dob);
    formDataToSend.append("firstMovie", formData.firstMovie);
    formDataToSend.append("awards", formData.awards);
    formDataToSend.append("netWorth", formData.netWorth);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("stagename",formData.stagename);
    // Append the image file to the FormData object
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    // Send the form data with the image using AXIOS
    AXIOS.post("http://localhost:9000/admin/add-artist", formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data", // Make sure the request is sent as multipart/form-data
      },
    })
      .then((res) => {
        alert(res.data.message);
        navigate("/admin/view-artists")

      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
      <Typography variant="h4" noWrap sx={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
        ADD ARTIST DETAILS
      </Typography>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TextField
            label="Name"
            name="name"
            variant="outlined"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
           <TextField
            label="Stage Name"
            name="stagename"
            variant="outlined"
            fullWidth
            value={formData.stagename}
            onChange={handleChange}
          />
          <TextField
            label="Birth Place"
            name="birthPlace"
            variant="outlined"
            fullWidth
            value={formData.birthPlace}
            onChange={handleChange}
          />
          <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.dob}
            onChange={handleChange}
          />
          <TextField
            label="First Movie"
            name="firstMovie"
            variant="outlined"
            fullWidth
            value={formData.firstMovie}
            onChange={handleChange}
          />
          <TextField
            label="Awards"
            name="awards"
            variant="outlined"
            fullWidth
            value={formData.awards}
            onChange={handleChange}
          />
          <TextField
            label="Net Worth in million($)"
            name="netWorth"
            type="number"
            variant="outlined"
            fullWidth
            value={formData.netWorth}
            onChange={handleChange}
          />
          <TextField
            select
            label="Role"
            name="role"
            variant="outlined"
            fullWidth
            value={formData.role}
            onChange={handleChange}
          >
            <MenuItem value="Actor">Actor</MenuItem>
            <MenuItem value="Actress">Actress</MenuItem>
            <MenuItem value="Director">Director</MenuItem>
            <MenuItem value="Cameraman">Cameraman</MenuItem>
            <MenuItem value="Producer">Producer</MenuItem>
          </TextField>
          <Button variant="contained" component="label" fullWidth>
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          {formData.image && (
            <Typography variant="body2" mt={1}>
              Selected File: {formData.image.name}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ArtistForm;
