import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import './App.css';
import Theaterhome from "./components/theater/theaterhome";
import Addmovies from "./components/theater/addmovies";
import Bookings from "./components/theater/bookings";
import Profile from "./components/theater/profile";
import AdminLogin from "./components/adminlogin";
import SearchedMovies from "./components/searchedMovies";
import UserSearchedMovies from "./components/user/userSearch";
import ViewReviews from "./components/admin/viewreview";

// Lazy loading components
const HomePage = React.lazy(() => import("./components/home"));
const Userhome = React.lazy(() => import("./components/user/userhome"));
const MovieDetailsPage = React.lazy(() => import("./components/viewdetail"));
const Bookmovie = React.lazy(() => import("./components/bookmovie"));
const ViewMovie = React.lazy(() => import("./components/user/viewmovies"));
const Mybooking = React.lazy(() => import("./components/user/mybooking"));
const AdminDashboard = React.lazy(() => import("./components/admin/dashboard"));
const ArtistForm = React.lazy(() => import("./components/admin/addartist"));
const AddMovieForm = React.lazy(() => import("./components/admin/addmovie"));
const ViewArtist = React.lazy(() => import("./components/admin/viewartist"));
const ViewMovies = React.lazy(() => import("./components/admin/viewcinema"));
const ViewReview = React.lazy(() => import("./components/admin/viewreview"));
const PaymentPage = React.lazy(() => import("./components/paymentpage"));
const RegisterTheater = React.lazy(() => import("./components/theater/register"));
const TheaterLogin = React.lazy(() => import("./components/theaterlogin"));
const UserRegister = React.lazy(() => import("./components/registerUser"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/userhome" element={<Userhome />} />
        <Route path="/search/:id" element={<SearchedMovies />} />
        <Route path="/user/search/:id" element={<UserSearchedMovies />} />
        <Route path="/movie-details/:id" element={<MovieDetailsPage />} />
        <Route path="/user/book-movie/:id" element={<Bookmovie />} />
        <Route path="/user/movie/:id" element={<ViewMovie />} />
        <Route path="user/mybooking" element={<Mybooking />} />
        <Route path="/payment-page" element={<PaymentPage />} />
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/login" element={<AdminLogin />} />
        {/* <Route path="/admin/add-artist-form" element={<ArtistForm />} />
        <Route path="/admin/add-movie-form" element={<AddMovieForm />} />
        <Route path="/admin/view-artists" element={<ViewArtist />} />
        <Route path="/admin/view-movies" element={<ViewMovies />} /> */}
        <Route path="/admin/viewreview" element={<ViewReview />} />


        {/* Other Routes */}

        <Route path="/register-theater" element={<RegisterTheater />} />
        <Route path="/theaterlogin" element={<TheaterLogin />} />
        <Route path="/register-user" element={<UserRegister />} />
        <Route path="/theaterhome" element={<Theaterhome />} />
        <Route path="/theaterhome/addmovies" element={<Addmovies />} />
        <Route path="/theaterhome/bookings" element={<Bookings />} />
        <Route path="/theaterhome/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
}

export default App;
