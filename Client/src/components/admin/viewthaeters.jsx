import axios from "axios";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

export default function ViewTheaters() {
  const [theaters, setTheaters] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9000/admin/viewusers")
      .then((res) => {
        console.log(res.data.theaters);
        setTheaters(res.data.theaters);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 800, margin: "auto", marginTop: 3 }}>
      <Typography variant="h4" noWrap sx={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
        THEATERS LIST
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Name</b></TableCell>
            <TableCell><b>Email</b></TableCell>
            <TableCell><b>License</b></TableCell>
            <TableCell><b>Location</b></TableCell>
            <TableCell><b>Movies</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {theaters.length > 0 ? (
            theaters.map((theater) => (
              <TableRow key={theater._id}>
                <TableCell>{theater.name}</TableCell>
                <TableCell>{theater.email}</TableCell>
                <TableCell>{theater.license}</TableCell>
                <TableCell>{theater.place}</TableCell>
                {theater.movies.map((movie, index) => (
                  <TableCell key={index}>{movie.movieName}</TableCell>
                ))}

              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No Theaters Available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
