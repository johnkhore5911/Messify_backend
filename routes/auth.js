const express = require("express");
const {registerUser, loginUser} = require("../controllers/authController")
const {getUserData,getUserDataByRoll} = require("../controllers/user")
const {updateBill,updateTodaysMeal} = require("../controllers/user")

const router = express.Router();
const {auth,isMessStaff}  = require("../middlewares/auth");

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/getUserData",auth,getUserData)
router.post("/getUserDataByRoll",auth,isMessStaff,getUserDataByRoll)

router.post("/updateBillAmount",auth,isMessStaff,updateBill)
router.post("/updateTodaysMeal",auth,isMessStaff,updateTodaysMeal);


module.exports = router;