const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrpyt = require("bcryptjs");


const getUserData = async (req,res) => {
    try{
        const userId = req.user.id;
        res.status(200).json({
            success: true,
            data: newCourse,
            message: `SUCCESS USER Id is this ${userId}`,
          });
    }
    catch(error){
        console.error(error);
        res.status(500).json({
          success: false,
          message: "Failed to fetch UserDetails",
          error: error.message,
        });
    }
}
module.exports = { getUserData };

