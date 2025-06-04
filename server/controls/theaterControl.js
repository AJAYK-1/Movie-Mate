const TheaterModel = require("../models/theaterModel");
const bcrypt = require("bcrypt");
const Booking=require('../models/bookingModel')
const jwt =require('jsonwebtoken')
const nodemailer = require('nodemailer');
const registerTheater = async (req, res) => {
    try {
        const { name, license, email, place, password } = req.body;

        // Check if theater already exists
        const existingTheater = await TheaterModel.findOne({ email });
        const existingLicense = await TheaterModel.findOne({license})
        if (existingTheater || existingLicense) {
            return res.status(400).json({ message: "Theater already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new theater
        const newTheater = new TheaterModel({
            name,
            license,
            email,
            place,
            password: hashedPassword,
        });

        await newTheater.save();
        res.status(201).json({ message: "Theater registered successfully", theater: newTheater });
    } catch (error) {
        res.status(500).json({ message: "Error registering theater", error: error.message });
    }
};


const theaterLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const theater = await TheaterModel.findOne({ email });
        if (!theater) {
            return res.status(404).json({ msg: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, theater.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }
        const token = jwt.sign(
            {theater},
           'jwt-authentication-key', 
            { expiresIn: "1h" } 
        );
        res.json({ msg: "Login successful","token":token,status:200});
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

const viewBooking=async(req,res)=>{
    try{
        const id=req.headers.id
        const mybooking = await Booking.find({ theaterId: id, paymentStatus: "Completed" })
        .populate("userId")
        .populate("movieId");
        res.json(mybooking)
    }catch(err){
        console.log(err)
    }
}


const viewProfile=async(req,res)=>{
    try{
        const id=req.headers.id
        const details=await TheaterModel.findOne({_id:id})
        res.json(details)
    }catch(err){
        console.log(err)
    }
}


const removeMovie = async (req, res) => {
    try {
        const { theaterId, movie } = req.body;
        console.log(req.body)
        if (!theaterId || !movie) {
            return res.status(400).json({ message: "Theater ID and movie are required" });
        }

        const movieData = {
            movieName: movie.toUpperCase(),
        };

        // Update the theater with the new movie and its shows
        const updatedTheater = await TheaterModel.findByIdAndUpdate(
            theaterId,
            { $pull: { movies: movieData } }, 
            { new: true }
        );

        if (!updatedTheater) {
            return res.status(404).json({ message: "Theater not found" });
        }

        res.json({ message: "Movie removed successfully", updatedTheater });
    } catch (err) {
        console.error("Error removing movie:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const addMovie = async (req, res) => {
    try {
        const { theaterId, movie, shows } = req.body;

        // Create the movie object with shows
        const movieData = {
            movieName: movie.toUpperCase(),
            shows: shows
        };

        // Update the theater with the new movie and its shows
        const updatedTheater = await TheaterModel.findByIdAndUpdate(
            theaterId,
            { $push: { movies: movieData } }, // Push the new movie with its shows
            { new: true }
        );

        if (!updatedTheater) {
            return res.status(404).json({ message: "Theater not found" });
        }

        res.json({ message: "Movie added successfully", updatedTheater });
    } catch (err) {
        console.error("Error adding movie:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}


const crypto = require("crypto"); 
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ajaykumar1shy@gmail.com", 
    pass: "nryx zqgn odmj ytvm",
  },
});


let storedOTP = null;
let otpExpiry = null;
 
const forgetPassword = async (req, res) => {
    const { email } = req.body;
    console.log(req.body)
    try {
      const user = await TheaterModel.findOne({email:email});
   
  
      
      const otp = crypto.randomInt(100000, 999999).toString(); // Generates a random 6-digit number
  
      // Step 3: Store the OTP and its expiry time (e.g., 10 minutes)
      storedOTP = otp;
      otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry time
  
      // Step 4: Send the OTP to the user's email
      const mailOptions = {
        from: "ajaykumar1shy@gmail.com",
        to: user.email,
        subject: "Password Reset OTP",
        html: `
          <p>You requested a password reset. Your OTP is: <strong>${otp}</strong></p>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        `,
      };
  
      // Send the email with the OTP
      await transporter.sendMail(mailOptions);
  
      // Step 5: Respond to the client with a success message and send the OTP
      return res.status(200).json({
        msg: "OTP sent to your email. It will expire in 10 minutes.",
        otp: otp,  // Send OTP to frontend
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "An error occurred while sending the OTP." });
    }
  };
  const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      // Step 1: Check if OTP exists and hasn't expired
      if (!storedOTP || Date.now() > otpExpiry) {
        return res.status(400).json({ msg: "OTP is either expired or invalid." });
      }
  
      // Step 2: Check if the entered OTP matches the stored one
      if (storedOTP !== otp) {
        return res.status(400).json({ msg: "Invalid OTP. Please try again." });
      }
  
      // Step 3: OTP is valid, proceed to reset the password (send reset link or change password)
      return res.status(200).json({ msg: "OTP verified successfully." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "An error occurred while verifying the OTP." });
    }
  };
  const updatePassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    
    console.log("Received email: ", email);
    const user=await TheaterModel.findOne({email:email})
    try {
       
      console.log("User found: ", user);
      user.password = await bcrypt.hash(newPassword,10); 
      await user.save();
  
      // Step 3: Return success message
      return res.status(200).json({ msg: "Password updated successfully!" });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "An error occurred while updating the password." });
    }
  };
  

  const updateProfile = async (req, res) => {
    try {
      const id = req.headers.id;  
      const { name, email, license, place } = req.body; 
        const theater = await TheaterModel.findById(id);
      if (!theater) {
        return res.status(404).json({ message: "Theater not found" });
      }
   theater.name = name || theater.name;  
      theater.email = email || theater.email;
      theater.license = license || theater.license;
      theater.place = place || theater.place;
      await theater.save();
      res.status(200).json(theater);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "An error occurred while updating the profile" });
    }
  };

   
module.exports = { registerTheater , viewBooking ,theaterLogin ,viewProfile ,removeMovie, addMovie,forgetPassword,updatePassword,verifyOTP, updateProfile};
