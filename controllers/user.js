const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrpyt = require("bcryptjs");


const getUserData = async (req,res) => {
  try {
    // Extract rollNumber from the request body
    const { rollNumber } = req.body;

    if (!rollNumber) {
      return res.status(400).json({
        success: false,
        message: "Roll number is required",
      });
    }

    // Fetch user from the database where rollNumber matches
    const user = await User.findOne({ rollNumber });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Respond with the found user data
    res.status(200).json({
      success: true,
      message: `User data fetched successfully`,
      data: user, // Send the user data as a response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch UserDetails",
      error: error.message,
    });
  }
}
module.exports = { getUserData };

