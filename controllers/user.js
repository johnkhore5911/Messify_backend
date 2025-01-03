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

// const updateTodaysMeal = async (req, res) => {
//   try {
//     const { items } = req.body;

//     const userId = req.user.id;

//     // Find the user by ID
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found." });
//     }
//     // Update the mess staff's (user's) today's meal as well
//     user.todaysMeal = items.map((item) => ({
//       item: item.itemName,
//       price: item.price,
//     }));

//     await user.save();
    
//     // Extract hostelNumber from the user
//     const { messNumber } = user;

//     if (!messNumber) {
//       return res.status(400).json({ success: false, message: "User does not belong to a hostel." });
//     }

//     // Validate input
//     if (!messNumber || !items || !Array.isArray(items)) {
//       return res.status(400).json({ success: false, message: "Invalid input." });
//     }

//     // Check that all items have the required structure
//     for (const item of items) {
//       if (!item.itemName || !item.price) {
//         return res.status(400).json({
//           success: false,
//           message: "Each item must have 'itemName' and 'price'.",
//         });
//       }
//     }

//     // Fetch all students in the specified hostel
//     const students = await User.find({
//       hostelNumber: messNumber,
//       // role: "Student",
//     });

//     if (students.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No students found for the specified hostel number.",
//       });
//     }

//     // Update today's meal for each student
//     const updatePromises = students.map((student) => {
//       student.todaysMeal = items.map((item) => ({
//         item: item.itemName,
//         price: item.price,
//       }));
//       return student.save();
//     });

//     // Wait for all updates to complete
//     await Promise.all(updatePromises);

//     // Respond with success
//     return res.status(200).json({
//       success: true,
//       message: "Today's meal updated successfully for all students in the specified hostel.",
//     });
//   } catch (error) {
//     console.error("Error updating today's meal:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error. Please try again later.",
//     });
//   }
// };

const updateTodaysMeal = async (req, res) => {
  try {
    const { items } = req.body;

    const userId = req.user.id;

    // Find the user (mess staff) by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Append new items to the mess staff's (user's) today's meal
    const newMeals = items.map((item) => ({
      item: item.itemName,
      price: item.price,
    }));

    // Push new meals into the existing array (if any)
    user.todaysMeal = [...user.todaysMeal, ...newMeals]; // This will append the new meals

    await user.save();

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
    const students = await User.find({ hostelNumber: messNumber });

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No students found for the specified hostel number.",
      });
    }

    // Update today's meal for each student
    const updatePromises = students.map((student) => {
      student.todaysMeal = [...student.todaysMeal, ...newMeals]; // Append new meals to existing ones
      return student.save();
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Today's meal updated successfully for all students and the mess staff.",
    });
  } catch (error) {
    console.error("Error updating today's meal:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};


// const deleteTodaysMealItem = async (req, res) => {
//   try {
//     const { itemId } = req.params; // Get item ID from request parameters
//     const userId = req.user.id;  // Get user ID from the authenticated user

//     // Find the user (mess staff) by ID
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found." });
//     }

//     // Find the specific item to delete
//     const itemIndex = user.todaysMeal.findIndex(item => item._id.toString() === itemId);

//     // If item doesn't exist
//     if (itemIndex === -1) {
//       return res.status(404).json({ success: false, message: "Item not found in today's meal." });
//     }

//     // Remove the item from the array
//     user.todaysMeal.splice(itemIndex, 1);

//     // Save the updated user record
//     await user.save();

//     // Return success response
//     return res.status(200).json({
//       success: true,
//       message: "Item deleted successfully from today's meal."
//     });
//   } catch (error) {
//     console.error("Error deleting item from today's meal:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error. Please try again later.",
//     });
//   }
// };


// const deleteTodaysMealItem = async (req, res) => {
//   try {
//     const { itemId } = req.params; // Get item ID from request parameters
//     const {itemName} = req.params;
//     console.log("ItemName: ",itemName)

//     console.log("ItemId from mess: ",itemId);
//     const userId = req.user.id;  // Get user ID from the authenticated user

//     // Find the user (mess staff) by ID
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found." });
//     }

//     // Get the messNumber of the user (mess staff)
//     const { messNumber } = user;

//     // Find the students whose hostelNumber matches the messNumber of the user
//     const students = await User.find({ hostelNumber: messNumber });
//     console.log("Console all students: ",students);

//     // if (!students || students.length === 0) {
//     //   return res.status(404).json({
//     //     success: false,
//     //     message: "No students found for the specified hostel number."
//     //   });
//     // }

//     // // Iterate through all students and remove the item from their todaysMeal array
//     // const updatePromises = students.map(async (student) => {
//     //   const itemIndex = student.todaysMeal.findIndex(item => item._id.toString() === itemId);
      
//     //   if (itemIndex !== -1) {
//     //     student.todaysMeal.splice(itemIndex, 1);  // Remove the item
//     //     await student.save();  // Save the updated student record
//     //   }
//     // });

//     if (students && students.length > 0) {
//       // Iterate through all students
//       const updatePromises = students.map(async (student) => {
//         // Log all item IDs in the today's meal array
//         student.todaysMeal.forEach(item => {
//           console.log("Item ID: ", item._id.toString());
//         });
    
//         const itemIndex = student.todaysMeal.findIndex(item => item.item === itemName);
//         console.log("Item index: ", itemIndex);
    
//         if (itemIndex !== -1) {
//           student.todaysMeal.splice(itemIndex, 1);  // Remove the item
//           await student.save();  // Save the updated student record
//         }
//       });
    
//       // Wait for all updates to complete
//       await Promise.all(updatePromises);
//       console.log("updatePromises", updatePromises);
//     }
      

//     // Now, delete the item from the mess staff's todaysMeal
//     const itemIndex = user.todaysMeal.findIndex(item => item._id.toString() === itemId);
//     if (itemIndex !== -1) {
//       user.todaysMeal.splice(itemIndex, 1);  // Remove the item from the mess staff's meal
//       await user.save();  // Save the updated mess staff record
//     }

//     // Return success response
//     return res.status(200).json({
//       success: true,
//       message: "Item deleted successfully from today's meal for all students and the mess staff."
//     });
//   } catch (error) {
//     console.error("Error deleting item from today's meal:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error. Please try again later.",
//     });
//   }
// };


// const deleteTodaysMealItem = async (req, res) => {
//   try {
//     const { itemName } = req.params; // Get itemName from request parameters
//     console.log("ItemName: ", itemName);

//     const userId = req.user.id; // Get user ID from the authenticated user

//     // Find the mess staff user by ID
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found." });
//     }

//     // Get the messNumber of the user (mess staff)
//     const { messNumber } = user;

//     // Find the students whose hostelNumber matches the messNumber of the user
//     const students = await User.find({ hostelNumber: messNumber });
//     console.log("All students in the hostel: ", students);

//     if (students && students.length > 0) {
//       // Iterate through all students to remove the specified item
//       const updatePromises = students.map(async (student) => {
//         const itemIndex = student.todaysMeal.findIndex(item => item.item === itemName);
//         console.log(`Student: ${student.name}, Item index: ${itemIndex}`);
        
//         if (itemIndex !== -1) {
//           student.todaysMeal.splice(itemIndex, 1); // Remove the item
//           await student.save(); // Save the updated student record
//         }
//       });

//       // Wait for all updates to complete
//       await Promise.all(updatePromises);
//       console.log("Updated meal data for all students.");
//     }

//     // Now, delete the item from the mess staff's todaysMeal
//     const itemIndexForStaff = user.todaysMeal.findIndex(item => item.item === itemName);
//     if (itemIndexForStaff !== -1) {
//       user.todaysMeal.splice(itemIndexForStaff, 1); // Remove the item from the mess staff's meal
//       await user.save(); // Save the updated mess staff record
//     }

//     // Return success response
//     return res.status(200).json({
//       success: true,
//       message: "Item deleted successfully from today's meal for all students and the mess staff."
//     });
//   } catch (error) {
//     console.error("Error deleting item from today's meal:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error. Please try again later.",
//     });
//   }
// };

// const deleteTodaysMealItem = async (req, res) => {
//   try {
//     const { itemName } = req.params; // Get itemName from request parameters
//     console.log("ItemName: ", itemName);

//     const userId = req.user.id; // Get user ID from the authenticated user

//     // Find the mess staff user by ID
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found." });
//     }

//     // Get the messNumber of the user (mess staff)
//     const { messNumber } = user;

//     // If mess staff's todaysMeal has only one item, clear it directly
//     if (user.todaysMeal.length === 1) {
//       user.todaysMeal = []; // Clear the array
//       await user.save(); // Save the updated mess staff record

//       // Find all students in the same hostel
//       const students = await User.find({ hostelNumber: messNumber });
//       if (students && students.length > 0) {
//         const updatePromises = students.map(async (student) => {
//           student.todaysMeal = []; // Clear the array for each student
//           await student.save(); // Save the updated student record
//         });

//         await Promise.all(updatePromises); // Wait for all updates to complete
//       }

//       // Return success response
//       return res.status(200).json({
//         success: true,
//         message: "All items deleted successfully from today's meal for mess and students.",
//       });
//     }
//     console.log("first")

//     // For cases where todaysMeal has more than one item
//     // Find all students in the same hostel
//     const students = await User.find({ hostelNumber: messNumber });
//     console.log("students: ",students)
//     if (students && students.length > 0) {
//       const updatePromises = students.map(async (student) => {
//         const itemIndex = student.todaysMeal.findIndex((item) => item.item === itemName);
//         console.log("itemIndex: ",itemIndex)
//         if (itemIndex !== -1) {
//           student.todaysMeal.splice(itemIndex, 1); // Remove the item
//           await student.save(); // Save the updated student record
//         }
//       });

//       await Promise.all(updatePromises); // Wait for all updates to complete
//     }

//     // Remove the item from the mess staff's todaysMeal
//     const itemIndexForStaff = user.todaysMeal.findIndex((item) => item.item === itemName);
//     if (itemIndexForStaff !== -1) {
//       user.todaysMeal.splice(itemIndexForStaff, 1); // Remove the item
//       await user.save(); // Save the updated mess staff record
//     }

//     // Return success response
//     return res.status(200).json({
//       success: true,
//       message: "Item deleted successfully from today's meal for all students and the mess staff.",
//     });
//   } catch (error) {
//     console.error("Error deleting item from today's meal:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error. Please try again later.",
//     });
//   }
// };

const deleteTodaysMealItem = async (req, res) => {
  try {
    const { itemName } = req.params; // Get itemName from request parameters
    console.log("ItemName: ", itemName);

    const userId = req.user.id; // Get user ID from the authenticated user

    // Find the mess staff user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Get the messNumber of the user (mess staff)
    const { messNumber } = user;

    // Remove the item from the mess staff's todaysMeal
    const itemIndexForStaff = user.todaysMeal.findIndex((item) => item.item === itemName);
    if (itemIndexForStaff !== -1) {
      user.todaysMeal.splice(itemIndexForStaff, 1); // Remove the item
      await user.save(); // Save the updated mess staff record
      console.log(`Item "${itemName}" removed from mess staff's todaysMeal.`);
    } else {
      console.log(`Item "${itemName}" not found in mess staff's todaysMeal.`);
    }

    // Find students in the same hostel
    const students = await User.find({ hostelNumber: messNumber });
    if (students && students.length > 0) {
      const updatePromises = students.map(async (student) => {
        const itemIndex = student.todaysMeal.findIndex((item) => item.item === itemName);
        if (itemIndex !== -1) {
          student.todaysMeal.splice(itemIndex, 1); // Remove the item
          await student.save(); // Save the updated student record
          console.log(`Item "${itemName}" removed from student "${student.name}"'s todaysMeal.`);
        }
      });

      await Promise.all(updatePromises); // Wait for all updates to complete
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: `Item "${itemName}" deleted successfully from today's meal for the mess staff and students.`,
    });
  } catch (error) {
    console.error("Error deleting item from today's meal:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};





module.exports = { getUserData,getUserDataByRoll,updateBillAmountAndHistory,updateTodaysMeal,deleteTodaysMealItem };

