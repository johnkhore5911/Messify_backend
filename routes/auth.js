const express = require("express");
const {registerUser, loginUser} = require("../controllers/authController")
const {getUserData} = require("../controllers/user")

const router = express.Router();
const {auth}  = require("../middlewares/auth");

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/getUserData",auth,getUserData)



module.exports = router;