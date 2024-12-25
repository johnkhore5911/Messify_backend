// const express = require('express');
// const app = express();

// //load config file
// // require("dotenv").config();
// // const PORT = process.env.PORT || 4000;

// //middleware to pass json request body
// app.use(express.json());

// const cors = require('cors');
// app.use(cors());

// const authRoutes = require('./routes/auth');
// app.use("/api/auth",authRoutes);


// app.listen(3000, ()=>{
//     console.log(`Server is started at 3000 successfully`); 
// })

// //connect to the database
// const dbConnect = require('./config/database');
// dbConnect();


// //default route
// app.get("/",(req,res)=>{
//     res.send(`<h1>This is HOMEPAGE</h1>`)
// })

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Initialize the app and create HTTP server
const app = express();
const server = http.createServer(app);

// Initialize socket.io and associate it with the server
const io = socketIo(server);

// Middleware to pass json request body
app.use(express.json());

// Enable CORS for cross-origin requests
app.use(cors());

// Your existing auth route (unchanged)
const authRoutes = require('./routes/auth');
app.use("/api/auth", authRoutes);

// Default route
app.get("/", (req, res) => {
    res.send(`<h1>This is HOMEPAGE</h1>`)
});

// API endpoint to trigger message (this is the endpoint that emits a message to all connected clients)
app.get("/trigger", (req, res) => {
    io.emit('message', 'Hello from the server!');  // Emit a 'message' event to all connected clients
    res.send('API hit successfully');
});

// Set up a connection event for Socket.IO
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for disconnect event
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Connect to the database (unchanged)
const dbConnect = require('./config/database');
dbConnect();

// Start the server on port 3000 (or whatever port you have set)
server.listen(3000, () => {
    console.log(`Server is started at 3000 successfully`);
});
