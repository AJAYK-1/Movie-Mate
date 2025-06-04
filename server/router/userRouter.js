const express=require('express')
const { loginUser, verifyOtp, userViewmovie, userBookTickets, getUserByEmail, useraddtickets, fetchBookedTicket, Viewmovie, ticketPayment, myBooking, addReview } = require('../controls/userControl')


const userRouter=express.Router()


userRouter.route("/login").post(loginUser)
userRouter.route("/verify").post(verifyOtp)
userRouter.route("/viewmovie").get(userViewmovie)
userRouter.route("/viewtheater/:id").get(userBookTickets)
userRouter.route("/getUserByEmail").get(getUserByEmail)
userRouter.route("/bookTickets").post(useraddtickets)
userRouter.route("/fetchbooked").get(fetchBookedTicket)
userRouter.route("/movie/:id").get(Viewmovie)
userRouter.route("/payment").post(ticketPayment)
userRouter.route("/mybooking").get(myBooking)
userRouter.route("/review").post(addReview)

module.exports=userRouter