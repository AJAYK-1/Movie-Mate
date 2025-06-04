const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/userModel'); // Assuming you have a User model
const Movie = require('../models/movieModel')
const Theater = require('../models/theaterModel')
const Booking = require('../models/bookingModel')
const jwt = require('jsonwebtoken')


const loginUser = async (req, res) => {
    const { name, email } = req.body;
    console.log(name, email);

    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name,
                email,
                otp: crypto.randomInt(100000, 999999),
                verify: false,
                otpExpiry: Date.now() + 10 * 60 * 1000,
            });
            await user.save();
            console.log('New user created:', user);
        } else {
            console.log(user);
            console.log(user.status)
            if (user.status != "Active") {
                return res.status(403).json({ message: 'User is Inactivated by admin' });
            }
            if (user.otpExpiry && Date.now() > user.otpExpiry) {
                user.otp = crypto.randomInt(100000, 999999);
                user.otpExpiry = Date.now() + 10 * 60 * 1000;
                user.verify = false;
                await user.save();
            }
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "ajaykumar1shy@gmail.com", // Store email in environment variables
                pass: 'nryx zqgn odmj ytvm', // Store password in environment variables 
            }
        });

        const mailOptions = {
            from: "ajaykumar1shy@gmail.com",
            to: email,
            subject: 'Moviemate OTP for login',
            text: `Your OTP is: ${user.otp}`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP:', error);
                return res.status(500).json({ message: 'Error sending OTP. Please try again later.' });
            }
            res.status(200).json({ message: 'OTP sent successfully' });
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// const loginUser = async (req, res) => {
//     const { name, email } = req.body;
//     console.log(name, email); // Assuming you're getting name and email from the request body

//     try {
//         // 1. Check if user exists
//         let user = await User.find({ 
//             email: email, 
//             status: { $ne: "Inactive" } 
//         });        
//         if (!user) {
//             // If the user does not exist, create a new user
//             user = new User({
//                 name,
//                 email,
//                 otp: crypto.randomInt(100000, 999999), // Generate OTP
//                 verify: false // Set verify to false until the OTP is verified
//             });
//             await user.save();
//             console.log('New user created:', user);
//         } else {
//             // If user exists, generate a new OTP for login
//             user.otp = crypto.randomInt(100000, 999999); // 6-digit OTP
//             user.verify = false; // Reset verify field
//             await user.save();
//         }

//         // 2. Send OTP via email
//         const transporter = nodemailer.createTransport({
//             service: 'gmail', // Or your email service
//             auth: {
//                 user: 'ajaykumar1shy@gmail.com',
//                 pass: 'nryx zqgn odmj ytvm'
//             }
//         });

//         const mailOptions = {
//             from: 'ajaykumar1shy@gmail.com',
//             to: email,
//             subject: 'Moviemate Otp for login',
//             text: `Your OTP is: ${user.otp}`
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 return res.status(500).json({ message: 'Error sending OTP', error });
//             }
//             res.status(200).json({ message: 'OTP sent successfully' });
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) {

            return res.status(404).json({ message: 'User not found' });
        }

        console.log(otp, "data:", user.otp)
        // Ensure OTP is a string for comparison (to avoid type issues)
        if (user.otp == otp) {
            // Update user to verified
            user.verify = true
            const token = jwt.sign({ user }, 'jwt-authentication-key', {
                expiresIn: '1h'
            });

            res.status(200).json({ message: 'User verified successfully', token: token });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
        console.log(user.verify)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const userViewmovie = async (req, res) => {
    try {
        // Fetch all movies from the database
        const movies = await Movie.find();

        // Send the movies as a JSON response
        res.status(200).json(movies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const Viewmovie = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        const movies = await Movie.find({ _id: id });
        console.log(movies)
        res.status(200).json(movies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


const userBookTickets = async (req, res) => {
    const id = req.params.id;
    console.log(id)
    const movieSent = await Movie.findOne({ _id: id });
    if (!movieSent) {
        return res.status(404).json({ message: "Movie not found" });
    }
    const name = movieSent.movieName;
    console.log(name);
    const theaters = await Theater.find({ "movies.movieName": name });
    console.log(theaters)
    if (theaters.length > 0) {
        res.json(theaters);
    } else {
        res.status(404).json({ message: "No theaters found for this movie" });
    }
};
// In your user controller
const getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.headers.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ userId: user._id });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const useraddtickets = async (req, res) => {
    console.log(req.body);
    try {
        const { userId, movieId, theaterId, date, time, seats, totalPrice } = req.body;

        const booking = new Booking({
            userId, movieId, theaterId, date, time, seats, totalPrice
        });

        await booking.save();

        res.status(200).json({ message: "Ticket booked successfully" ,booking:booking});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

const ticketPayment = async (req, res) => {
    try {
        const id = req.headers.id;
        const { movieid } = req.body;
        console.log("User ID:", id, "Movie ID:", movieid);
        // Find and update the booking in one step
        const movie = await Booking.findOneAndUpdate(
            { userId: id, _id: movieid },
            { paymentStatus: "Completed" },
            { new: true } // Returns the updated document
        );
        // If no booking found, return 404
        if (!movie) {
            return res.status(404).json({ message: "Booking not found." });
        }
        console.log("Updated Booking:", movie);
        res.status(200).json({ message: "Payment Completed Successfully.", updatedBooking: movie });
    } catch (err) {
        console.error("Error in ticketPayment:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const fetchBookedTicket = async (req, res) => {
    try {
        const booked = await Booking.find({ paymentStatus: "Completed" })
            .populate('movieId')
            .populate('theaterId');
        res.status(200).json(booked);
        console.log("Booked Tickets")
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong while fetching booked tickets" });
    }
};


const myBooking = async (req, res) => {
    try {
        const id = req.headers.id
        const mybooking = await Booking.find({ userId: id })
        res.json(mybooking)
    } catch (err) {
        console.log(err)
    }
}

const addReview = async (req, res) => {
    const { movieId, userId, review } = req.body
    const addreview = await Movie.findById({ _id: movieId })
    const reviews = {
        userId: userId,
        reviewText: review,
        createdAt: new Date(),
    };
    addreview.review.push(reviews);
    await addreview.save();
    return res.status(201).json({ message: 'Review added successfully' });
}

module.exports = { myBooking, loginUser, verifyOtp, userViewmovie, userBookTickets, getUserByEmail, useraddtickets, fetchBookedTicket, Viewmovie, ticketPayment, addReview };
