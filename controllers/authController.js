const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrpyt = require("bcryptjs");


const registerUser = async (req,res) => {
    try{
        // const {name , email, password, role } = req.body;
        const { name, email, password, role, messNumber, hostelNumber, roomDetails, rollNumber } = req.body;


        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields.",
              });
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists",
              });
        }

        let hashedPassword;
        try{
            hashedPassword = await bcrpyt.hash(password,10);
        }
        catch(err){
            console.log("Error while hashing hte password",err);
            return res.status(500).json({
                success:false,
                message:"Error in hashing password"
            })
        }


        const newUser  = new User({
            name,
            email,
            password:hashedPassword,
            role,
            messNumber,
            hostelNumber,
            roomDetails,
            rollNumber,
      			image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
        })
       
        const savedUser = await newUser.save();
        console.log(savedUser);

        return res.status(201).json({
            success: true,
            message: `Welcome ${name}! User created successfully.`,
          });

    }
    catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({
          success: false,
          message: "Server error. Please try again later.",
        });
    }
}

const loginUser = async (req, res) => {
  try {
    //FETCH DATA
    const { email, password } = req.body;

    //validation on email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details carefully",
      });
    }

    //check existing user
    let user = await User.findOne({ email });

    //if not a register user
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not exist please sign up and then login",
      });
    }

    // if users exist and validated
    //verify password and generate JWT token
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };
    if (await bcrpyt.compare(password, user.password)) {
      //password match
      //login and give JWT token
      //create JWT token
      let token = jwt.sign(payload, 'john', {
        expiresIn: "24h",
      });

    //   user.token = token;
    //   user.password = undefined;

    //M-2
    // console.log(user);
    // const oldUser = {...user,token}
    // oldUser.password = undefined;
    // console.log(oldUser);

    //M-3



    user = user.toObject();
    user.token = token;
    console.log(user);
    user.password = undefined;
    console.log(user);

    const options ={
      expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000),
      //not access on client side
      httpOnly:true,
    }
    res.cookie("token",token,options).status(200).json({
      success:true,
      token,
      user,
      message:"User Logged in successfully"
    })
    
    } 
    else {
      //password does not match
      return res.status(403).json({
        success: false,
        message: "Please enter correct Password",
      });

    }
  } catch (erro) {
    console.log(erro);
    return res.status(500).json({
        success:false,
        message:'Login failed'
    })
  }
};


module.exports = { registerUser, loginUser };

