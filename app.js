require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const router = require("./routes/router.js");
const paymentRouter = require("./routes/payment.js");
const connectDB = require('./config/db.js');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

app.get("/test",(req,res)=>{
    return res.json({message : "I m All ready and excited Nishaaaaa !!!"});
});

// Routes
app.use("/api",router);
app.use("/payment",paymentRouter);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
