const express = require("express");
const {registerUser, loginUser} = require("../controllers/authController")
const {getUserData,getUserDataByRoll} = require("../controllers/user")
const {updateBillAmountAndHistory,updateTodaysMeal,deleteTodaysMealItem} = require("../controllers/user")

const router = express.Router();
const {auth,isMessStaff}  = require("../middlewares/auth");

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/getUserData",auth,getUserData)
router.post("/getUserDataByRoll",auth,isMessStaff,getUserDataByRoll)

router.post("/updateBillAmountAndHistory",auth,isMessStaff,updateBillAmountAndHistory)
router.post("/updateTodaysMeal",auth,isMessStaff,updateTodaysMeal);
router.delete('/deleteTodaysMealItem/:itemId',auth,isMessStaff, deleteTodaysMealItem);


module.exports = router;