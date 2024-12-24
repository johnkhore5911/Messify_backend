const mongoose = require('mongoose');

// require("dotenv").config();

const dbConnect = () => {
    mongoose.connect('mongodb+srv://johnkhore26:fOY0HMtF55rrXwMO@cluster0.8tyts.mongodb.net/', {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=>console.log("db connection is successfull"))
    .catch((error)=>{
        console.log("Issue in db connection");
        console.error(error.message);
        process.exit(1);
    });
}
module.exports = dbConnect;  