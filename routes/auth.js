const express = require("express");
const {registerUser, loginUser} = require("../controllers/authController")
const {getUserData} = require("../controllers/user")
const {updateBill,updateTodaysMeal} = require("../controllers/user")

const router = express.Router();
const {auth}  = require("../middlewares/auth");

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/getUserData",getUserData)
router.post("/updateBillAmount",updateBill)
router.post("/updateTodaysMeal",updateTodaysMeal);


module.exports = router;