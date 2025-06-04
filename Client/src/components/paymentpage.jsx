import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Typography, TextField, Grid } from "@mui/material";
import axios from "axios";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const totalPrice = location.state?.price || 0;
  const userid=location.state.userid
  const movieid=location.state.movieid
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [cardType, setCardType] = useState("");
  const [error, setError] = useState("");

  const detectCardType = (number) => {
    if (/^4/.test(number)) return "Visa";
    if (/^5[1-5]/.test(number)) return "MasterCard";
    if (/^3[47]/.test(number)) return "American Express";
    if (/^6/.test(number)) return "Discover";
    return "";
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    setCardNumber(value);
    setCardType(detectCardType(value));
  };

  const handlePayment = () => {
    if (cardNumber.length !== 16 || !/^[0-9]+$/.test(cardNumber)) {
      setError("Invalid card number");
      return;
    }
    if (!expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      setError("Invalid expiry date (MM/YY format)");
      return;
    }
    if (cvv.length !== 3 || !/^[0-9]+$/.test(cvv)) {
      setError("Invalid CVV");
      return;
    }
    if (!cardholderName.trim()) {
      setError("Cardholder name cannot be empty");
      return;
    }
    console.log(userid)
    axios.post("http://localhost:9000/user/payment",{movieid},{headers:{id:userid}})
    .then((res)=>{
    alert(res.data.message)
    // if(res.data.status==200){
      navigate('/user/userhome')
      sessionStorage.clear()
    // }
    }).catch((err)=>{
      console.log("error",err)
    })
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card sx={{ minWidth: 400, padding: 3, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Secure Payment
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Total Price: ${totalPrice.toFixed(2)}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Cardholder Name"
                variant="outlined"
                fullWidth
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Card Number"
                variant="outlined"
                fullWidth
                inputProps={{ maxLength: 16 }}
                value={cardNumber}
                onChange={handleCardNumberChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary">
                Card Type: {cardType || "Unknown"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Expiry Date (MM/YY)"
                variant="outlined"
                fullWidth
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="CVV"
                variant="outlined"
                fullWidth
                type="password"
                inputProps={{ maxLength: 3 }}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </Grid>
          </Grid>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            fullWidth
            onClick={handlePayment}
          >
            Pay Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
