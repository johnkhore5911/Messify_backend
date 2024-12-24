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


const updateBill = async (req, res) => {
  try {
    // Extract rollNumber and totalBill from the request body
    const { rollNumber, totalBill } = req.body;

    if (!rollNumber) {
      return res.status(400).json({
        success: false,
        message: "Roll number is required",
      });
    }

    if (typeof totalBill !== "number" || totalBill <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid total bill amount is required",
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

    // Update the user's total bill
    user.bill = (user.bill || 0) + totalBill; // Add to the existing total bill
    await user.save(); // Save the updated user document

    // Respond with the updated user data
    res.status(200).json({
      success: true,
      message: `User bill updated successfully`,
      data: user, // Send the updated user data as a response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update UserDetails",
      error: error.message,
    });
  }
};


module.exports = { getUserData,updateBill };

