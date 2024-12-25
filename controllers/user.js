const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrpyt = require("bcryptjs");




const getUserData = async (req,res) => {
  try {
    const userId = req.user.id;
    console.log("userid: ",userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Roll number is required",
      });
    }

    // // Fetch user from the database where rollNumber matches
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // // Respond with the found user data
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


const getUserDataByRoll = async (req,res) => {
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


const updateBillAmountAndHistory = async (req,res) => {
  try{
    const { rollNumber, totalBill,items  } = req.body;

    // Find the user by roll number
    const user = await User.findOne({ rollNumber });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Add a new entry to the history array
    const billUpdateHistory = {
      action: 'Bill Updated',
      date: new Date(),
      amount: totalBill,
      previousBill: user.bill,
      newBill: user.bill + totalBill,
      description: 'Bill updated due to additional charges', // Optional description
      items: items,
    };

    // Update the user's bill amount
    user.bill += totalBill;

    user.history.push(billUpdateHistory);

    // Save the updated user document
    await user.save();

    res.status(200).json({
      success: true,
      message: `User Bill updated successfully`,
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

const updateTodaysMeal = async (req, res) => {
  try {
    const { items } = req.body;

    const userId = req.user.id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Extract hostelNumber from the user
    const { messNumber } = user;

    if (!messNumber) {
      return res.status(400).json({ success: false, message: "User does not belong to a hostel." });
    }

    // Validate input
    if (!messNumber || !items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: "Invalid input." });
    }

    // Check that all items have the required structure
    for (const item of items) {
      if (!item.itemName || !item.price) {
        return res.status(400).json({
          success: false,
          message: "Each item must have 'itemName' and 'price'.",
        });
      }
    }

    // Fetch all students in the specified hostel
    const students = await User.find({
      hostelNumber: messNumber,
      role: "Student",
    });

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No students found for the specified hostel number.",
      });
    }

    // Update today's meal for each student
    const updatePromises = students.map((student) => {
      student.todaysMeal = items.map((item) => ({
        item: item.itemName,
        price: item.price,
      }));
      return student.save();
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Today's meal updated successfully for all students in the specified hostel.",
    });
  } catch (error) {
    console.error("Error updating today's meal:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = { getUserData,getUserDataByRoll,updateBillAmountAndHistory,updateTodaysMeal };

