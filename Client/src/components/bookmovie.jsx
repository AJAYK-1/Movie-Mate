// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import "./styles.css";

// const seats = Array.from({ length: 75 }, (_, i) => i + 1).reverse();
// const ticketPrices = {
//   "Morning Show 10AM":25,
//   "Morning Show 10:30AM":30,
//   "Morning Show 11AM":50,
//   "Morning Show 11:30AM":60,
//   "Noon Show 12PM":65,
//   "Noon Show 12:30PM":40,
//   "Noon Show 2PM":65,
//   "Noon Show 2:30PM":55,
//   "Evening Show 5PM":70,
//   "Evening Show 6PM":65,
//   "Evening Show 7PM":75,
//   "Night Show 9PM":80,
//   "Late Night Show 11PM":110
// };

// export default function BookMovie() {
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
//   const [theaters, setTheaters] = useState([]);
//   const [booked, setBooked] = useState([]);
//   const [bookedSeats, setBookedSeats] = useState([]);
//   const [selectedTheater, setSelectedTheater] = useState("");
//   const [userId, setUserId] = useState(null);
//   const [movieName, setMovieName] = useState("");

//   const { id } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Retrieve the booking details from sessionStorage
//     const savedBookingDetails = sessionStorage.getItem("bookingDetails");

//     if (savedBookingDetails) {
//       const { selectedDate, selectedTime, selectedSeats, selectedTheater } = JSON.parse(savedBookingDetails);

//       // Set the state with the saved details
//       setSelectedDate(selectedDate);
//       setSelectedTime(selectedTime);
//       setSelectedSeats(selectedSeats);
//       setSelectedTheater(selectedTheater);
//     }

//     const email = localStorage.getItem("email");

//     if (email) {
//       axios
//         .get(`http://localhost:9000/user/getUserByEmail/`, { headers: { email } })
//         .then((res) => setUserId(res.data.userId))
//         .catch((err) => console.error("Error fetching user:", err));
//     }

//     // Fetch movie details and filter theaters
//     const fetchAndFilterTheaters = async () => {
//       try {
//         const movieResponse = await axios.get(`http://localhost:9000/user/movie/${id}`);
//         console.log("Movie API Response:", movieResponse.data);

//         if (!Array.isArray(movieResponse.data) || movieResponse.data.length === 0) {
//           console.error("Movie not found or response is not an array");
//           return;
//         }

//         const movie = movieResponse.data[0];
//         const movieName = movie.movieName;

//         setMovieName(movieName);
//         console.log(movieName)
//         const theaterResponse = await axios.get(`http://localhost:9000/user/viewtheater/${id}`);
//         console.log("Theater API Response:", theaterResponse.data);
        
//         // Filtering theaters based on the movieName inside each theater's movies array
//         const filteredTheaters = theaterResponse.data.map((theater) => {
//           // Filter movies inside each theater that match the movieName
//           const filteredMovies = theater.movies.filter((movie) =>
//             movie.movieName.includes(movieName) // Check if the movie name includes the searched name
//           );
        
//           // For each filtered movie, filter the shows inside that movie
//           const filteredMoviesWithShows = filteredMovies.map((movie) => {
//             const filteredShows = movie.shows;

//             return { ...movie, shows: filteredShows };
//           });
//           console.log("shows", filteredMoviesWithShows);
//           return { ...theater, movies: filteredMoviesWithShows };
//         }).filter((theater) => theater.movies.length > 0);

//         setTheaters(filteredTheaters);
//         console.log("Filtered Theaters:", filteredTheaters);

//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchAndFilterTheaters();

//     axios
//       .get("http://localhost:9000/user/fetchbooked")
//       .then((res) => {
//         setBooked(res.data);
//         console.log("booked seats", res.data);
//       })
//       .catch((err) => console.error("Error fetching booked seats:", err));
//   }, [id]);

  // useEffect(() => {
  //   if (selectedTheater && selectedDate && selectedTime && booked.length > 0) {
  //     const filteredSeats = booked
  //       .filter(
  //         (ticket) =>
  //           ticket.movieId._id === id &&
  //           ticket.theaterId._id === selectedTheater &&
  //           ticket.date.split("T")[0] === selectedDate &&
  //           ticket.time === selectedTime
  //       )
  //       .flatMap((ticket) => ticket.seats);

  //     setBookedSeats(filteredSeats.map(Number));
  //   }
  // }, [selectedTheater, selectedDate, selectedTime, booked, id]);

  // const toggleSeat = (seat) => {
  //   if (bookedSeats.includes(seat)) {
  //     alert("This seat is already booked. Please choose another.");
  //     return;
  //   }
  //   setSelectedSeats((prev) =>
  //     prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
  //   );
  // };

  // const seatRows = [];
  // const seatsPerRow = 10;
  // for (let i = 0; i < seats.length; i += seatsPerRow) {
  //   seatRows.push(seats.slice(i, i + seatsPerRow));
  // }

  // const calculatePrice = () => {
  //   return selectedTime && selectedSeats.length > 0
  //     ? ticketPrices[selectedTime] * selectedSeats.length
  //     : 0;
  // };

  // const handleBooking = () => {
  //   if (!userId) {
  //     alert("User not logged in");
  //     return;
  //   }
  //   if (!selectedTheater || !selectedDate || !selectedTime || selectedSeats.length === 0) {
  //     alert("Please complete all the fields.");
  //     return;
  //   }

  //   // Prepare booking details to save in sessionStorage
  //   const bookingDetails = {
  //     selectedDate,
  //     selectedTime,
  //     selectedSeats,
  //     totalPrice: calculatePrice(),
  //     selectedTheater
  //   };

  //   // Save booking details to sessionStorage
  //   sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

  //   const email = localStorage.getItem("email");

  //   axios
  //     .post("http://localhost:9000/user/bookTickets", {
  //       userId,
  //       movieId: id,
  //       date: selectedDate,
  //       time: selectedTime,
  //       seats: selectedSeats,
  //       totalPrice: calculatePrice(),
  //       theaterId: selectedTheater,
  //       email,
  //     })
  //     .then((res) => {
  //       if (res.status === 200) {
  //         navigate("/payment-page", {
  //           state: {
  //             price: bookingDetails.totalPrice,
  //             userid: userId,
  //             movieid: id
  //           }
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Error booking tickets:", err);
  //       alert("There was an issue with the booking. Please try again later.");
  //     });
  // };

//   return (
//     <div className="container mt-4">
//       <h1 className="mb-3 text-center">Book Your Movie Tickets</h1>

//       <div className="space-y-4">
//         <div className="grid grid-cols-3 gap-4 boxt">
//           {theaters.map((theater) => (
//             <div
//               key={theater._id}
//               className={`p-4 border rounded-xl shadow-md cursor-pointer transition duration-300 hover:shadow-lg boxtsub ${
//                 selectedTheater === theater._id ? "bg-gray-200" : "bg-white"
//               }`}
//               onClick={() => setSelectedTheater(theater._id)}
//             >
//               <h3 className="text-lg font-semibold">{theater.name}</h3>
//               <p className="text-gray-600">{theater.place}</p>
//             </div>
//           ))}
//         </div>

//         {selectedTheater && (
//           <div className="p-4 border rounded-xl shadow-md bg-gray-100">
//             <h2 className="text-xl font-bold">Selected Theater</h2>
//             <p className="text-gray-700">
//               {theaters.find((t) => t._id === selectedTheater)?.name}, {" "}
//               {theaters.find((t) => t._id === selectedTheater)?.place}
//             </p>
//           </div>
//         )}
//       </div>

      // <div className="form-group">
      //   <label>Select Date:</label>
      //   <input
      //     type="date"
      //     className="form-control"
      //     value={selectedDate}
      //     onChange={(e) => setSelectedDate(e.target.value)}
      //     min={new Date().toISOString().split("T")[0]}
      //   />
      // </div>

//       <div className="form-group mt-2">
//         <label>Select Show Time:</label>
//         <select
//           className="form-control"
//           value={selectedTime}
//           onChange={(e) => setSelectedTime(e.target.value)}
//         >
//           <option value="">Select Show Time</option>
//           {theaters.map((theater) =>
//             theater.movies.map((movie) =>
//               movie.shows.map((show, index) => (
//                 <option key={index} value={show}>
//                   {show}
//                 </option>
//               ))
//             )
//           )}
//         </select>
//       </div>

//       <div className="theater mt-3">
//         {seatRows.map((row, rowIndex) => (
//           <div key={rowIndex} className="seat-row">
//             {row.map((seat, seatIndex) => (
//               <button
//                 key={seat}
//                 className={`seat-btn ${selectedSeats.includes(seat) ? "selected" : ""}`}
//                 onClick={() => toggleSeat(seat)}
//                 disabled={bookedSeats.includes(seat)}
//                 style={{
//                   marginRight: (seatIndex + 1) % 5 === 0 ? "20px" : "0",
//                   backgroundColor: bookedSeats.includes(seat) ? "red" : "",
//                   cursor: bookedSeats.includes(seat) ? "not-allowed" : "pointer",
//                 }}
//               >
//                 {seat}
//               </button>
//             ))}
//           </div>
//         ))}
//       </div>

//       <p className="text-center mt-3">Selected Seats: {selectedSeats.join(", ") || "None"}</p>
//       <p className="text-center">Total Price: Rs.{calculatePrice()}</p>
//       <button
//         className="book-btn w-100"
//         disabled={!selectedDate || !selectedTime || selectedSeats.length === 0 || !selectedTheater}
//         onClick={handleBooking}
//       >
//         Book Now
//       </button>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./styles.css";

// Your seat and ticketPrice configurations remain unchanged
const seats = Array.from({ length: 75 }, (_, i) => i + 1).reverse();
const ticketPrices = {
  "Morning Show 10AM": 100,
  "Morning Show 10:30AM": 100,
  "Morning Show 11AM": 100,
  "Morning Show 11:30AM": 100,
  "Noon Show 12PM": 100,
  "Noon Show 12:30PM": 100,
  "Noon Show 2PM": 100,
  "Noon Show 2:30PM": 100,
  "Evening Show 5PM": 100,
  "Evening Show 6PM": 100,
  "Evening Show 7PM": 100,
  "Night Show 9PM": 100,
  "Late Night Show 11PM": 100
};

export default function BookMovie() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [theaters, setTheaters] = useState([]);
  const [booked, setBooked] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState("");
  const [userId, setUserId] = useState(null);
  const [movieName, setMovieName] = useState("");
  const [filteredMoviesWithShows, setFilteredMoviesWithShows] = useState([]); // Store filtered shows for the selected theater/movie

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the booking details from sessionStorage
    const savedBookingDetails = sessionStorage.getItem("bookingDetails");

    if (savedBookingDetails) {
      const { selectedDate, selectedTime, selectedSeats, selectedTheater } = JSON.parse(savedBookingDetails);
      setSelectedDate(selectedDate);
      setSelectedTime(selectedTime);
      setSelectedSeats(selectedSeats);
      setSelectedTheater(selectedTheater);
    }

    const email = localStorage.getItem("email");

    if (email) {
      axios
        .get(`http://localhost:9000/user/getUserByEmail/`, { headers: { email } })
        .then((res) => setUserId(res.data.userId))
        .catch((err) => console.error("Error fetching user:", err));
    }

    const fetchAndFilterTheaters = async () => {
      try {
        const movieResponse = await axios.get(`http://localhost:9000/user/movie/${id}`);
        console.log("Movie API Response:", movieResponse.data);

        if (!Array.isArray(movieResponse.data) || movieResponse.data.length === 0) {
          console.error("Movie not found or response is not an array");
          return;
        }

        const movie = movieResponse.data[0];
        const movieName = movie.movieName;
        setMovieName(movieName);
        console.log(movieName);

        const theaterResponse = await axios.get(`http://localhost:9000/user/viewtheater/${id}`);
        console.log("Theater API Response:", theaterResponse.data);

        // Filter theaters based on the movieName inside each theater's movies array
        const filteredTheaters = theaterResponse.data.map((theater) => {
          const filteredMovies = theater.movies.filter((movie) =>
            movie.movieName.includes(movieName)
          );

          // For each filtered movie, filter the shows inside that movie
          const filteredMoviesWithShows = filteredMovies.map((movie) => {
            const filteredShows = movie.shows;

            return { ...movie, shows: filteredShows };
          });

          return { ...theater, movies: filteredMoviesWithShows };
        }).filter((theater) => theater.movies.length > 0);

        setTheaters(filteredTheaters);
        console.log("Filtered Theaters:", filteredTheaters);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAndFilterTheaters();

    axios
      .get("http://localhost:9000/user/fetchbooked")
      .then((res) => {
        setBooked(res.data);
        console.log("booked seats", res.data);
      })
      .catch((err) => console.error("Error fetching booked seats:", err));
  }, [id]);

  useEffect(() => {
    if (selectedTheater && selectedDate && selectedTime && booked.length > 0) {
      const filteredSeats = booked
        .filter(
          (ticket) =>
            ticket.movieId._id === id &&
            ticket.theaterId._id === selectedTheater &&
            ticket.date.split("T")[0] === selectedDate &&
            ticket.time === selectedTime
        )
        .flatMap((ticket) => ticket.seats);

      setBookedSeats(filteredSeats.map(Number));
    }
  }, [selectedTheater, selectedDate, selectedTime, booked, id]);

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) {
      alert("This seat is already booked. Please choose another.");
      return;
    }
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const seatRows = [];
  const seatsPerRow = 10;
  for (let i = 0; i < seats.length; i += seatsPerRow) {
    seatRows.push(seats.slice(i, i + seatsPerRow));
  }

  const calculatePrice = () => {
    return selectedTime && selectedSeats.length > 0
      ? ticketPrices[selectedTime] * selectedSeats.length
      : 0;
  };

  const handleBooking = () => {
    if (!userId) {
      alert("User not logged in");
      return;
    }
    if (!selectedTheater || !selectedDate || !selectedTime || selectedSeats.length === 0) {
      alert("Please complete all the fields.");
      return;
    }

    // Prepare booking details to save in sessionStorage
    const bookingDetails = {
      selectedDate,
      selectedTime,
      selectedSeats,
      totalPrice: calculatePrice(),
      selectedTheater
    };

    // Save booking details to sessionStorage
    sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

    const email = localStorage.getItem("email");

    axios
      .post("http://localhost:9000/user/bookTickets", {
        userId,
        movieId: id,
        date: selectedDate,
        time: selectedTime,
        seats: selectedSeats,
        totalPrice: calculatePrice(),
        theaterId: selectedTheater,
        email,
      })
      .then((res) => {
        if (res.status === 200) {
          let bookid=res.data.booking._id
          navigate("/payment-page", {
            state: {
              price: bookingDetails.totalPrice,
              userid: userId,
              movieid: bookid
            }
          });
        }
      })
      .catch((err) => {
        console.error("Error booking tickets:", err);
        alert("There was an issue with the booking. Please try again later.");
      });
  };

  const handleTheaterSelection = (theaterId) => {
    setSelectedTheater(theaterId);
    // Find the selected theater and movie, then set available shows
    const selectedTheaterData = theaters.find((theater) => theater._id === theaterId);
    if (selectedTheaterData) {
      const movieData = selectedTheaterData.movies.find((movie) =>
        movie.movieName.includes(movieName)
      );
      if (movieData) {
        setFilteredMoviesWithShows(movieData.shows); // Update available shows based on the selected theater and movie
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-3 text-center">Book Your Movie Tickets</h1>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 boxt">
          {theaters.map((theater) => (
            <div
              key={theater._id}
              className={`p-4 border rounded-xl shadow-md cursor-pointer transition duration-300 hover:shadow-lg boxtsub ${
                selectedTheater === theater._id ? "bg-gray-200" : "bg-white"
              }`}
              onClick={() => handleTheaterSelection(theater._id)}
            >
              <h3 className="text-lg font-semibold">{theater.name}</h3>
              <p className="text-gray-600">{theater.place}</p>
            </div>
          ))}
        </div>

        {selectedTheater && (
          <div className="p-4 border rounded-xl shadow-md bg-gray-100">
            <h2 className="text-xl font-bold">Selected Theater</h2>
            <p className="text-gray-700">
              {theaters.find((t) => t._id === selectedTheater)?.name}, {" "}
              {theaters.find((t) => t._id === selectedTheater)?.place}
            </p>
          </div>
        )}
      </div>
      <div className="form-group">
        <label>Select Date:</label>
        <input
          type="date"
          className="form-control"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>
      <div className="form-group mt-2">
        <label>Select Show Time:</label>
        <select
          className="form-control"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          <option value="">Select Show Time</option>
          {filteredMoviesWithShows.map((show, index) => (
            <option key={index} value={show}>
              {show}
            </option>
          ))}
        </select>
      </div> <br />

      <div className="theater mt-3">
        {seatRows.map((row, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            {row.map((seat, seatIndex) => (
              <button
                key={seat}
                className={`seat-btn ${selectedSeats.includes(seat) ? "selected" : ""}`}
                onClick={() => toggleSeat(seat)}
                disabled={bookedSeats.includes(seat)}
                style={{
                  marginRight: (seatIndex + 1) % 5 === 0 ? "20px" : "0",
                  backgroundColor: bookedSeats.includes(seat) ? "red" : "",
                  cursor: bookedSeats.includes(seat) ? "not-allowed" : "pointer",
                }}
              >
                {seat}
              </button>
            ))}
          </div>
        ))}
      </div>

      <p className="text-center mt-3">Selected Seats: {selectedSeats.join(", ") || "None"}</p>
      <p className="text-center">Total Price: Rs.{calculatePrice()}</p>
      <button
        className="book-btn w-100"
        disabled={!selectedDate || !selectedTime || selectedSeats.length === 0 || !selectedTheater}
        onClick={handleBooking}
      >
        Book Now
      </button>
    </div>
  );
}
