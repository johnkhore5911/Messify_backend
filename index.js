const express = require('express');
const app = express();

//load config file
// require("dotenv").config();
// const PORT = process.env.PORT || 4000;

//middleware to pass json request body
app.use(express.json());

const cors = require('cors');
app.use(cors());

const authRoutes = require('./routes/auth');
app.use("/api/auth",authRoutes);


app.listen(3000, ()=>{
    console.log(`Server is started at 3000 successfully`); 
})

//connect to the database
const dbConnect = require('./config/database');
dbConnect();


//default route
app.get("/",(req,res)=>{
    res.send(`<h1>This is HOMEPAGE</h1>`)
})