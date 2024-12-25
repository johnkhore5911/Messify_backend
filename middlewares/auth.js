const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
// exports.auth = async (req, res, next) => {
//     console.log("I AM INSIDE AUTH")
//     try{
//         // //extract token
//         // const token = req.cookies.token 
//         //                 || req.body.token 
//         //                 || req.header("Authorization").replace("Bearer ", "");
//         const token = req.header("Authorization").replace("Bearer ","");
    
//         console.log("Token is this: ",token);
//         //if token missing, then return response
//         if(!token) {
//             return res.status(401).json({
//                 success:false,
//                 message:'Token is missing',
//             });
//         }

//         // //verify the token
//         // try{
//         //     const decode =  jwt.verify(token, "john");
//         //     console.log(decode);
//         //     req.user = decode;
//         // }
//         // catch(err) {
//         //     //verification - issue
//         //     return res.status(401).json({
//         //         success:false,
//         //         message:'token is invalid',
//         //     });
//         // }
//         next();
//     }
//     catch(error) {  
//         return res.status(401).json({
//             success:false,
//             message:'Something went wrong while validating the token',
//         });
//     }
// }

exports.auth = async (req, res, next) => {
    console.log("I AM INSIDE AUTH");

    try {
        // Extract token from the Authorization header
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header missing or invalid',
            });
        }

        const token = authHeader.replace("Bearer ", "");
        console.log("Token is this: ", token);

        // Verify the token
        try {
            const decoded = jwt.verify(token, "john"); // Replace "john" with your secret key
            console.log("Decoded Token: ", decoded);
            req.user = decoded; // Attach decoded token to request for use in other middleware/routes
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid or expired',
            });
        }

        next(); // Proceed to the next middleware or route
    } catch (error) {
        console.error("Error in auth middleware:", error);
        return res.status(401).json({
            success: false,
            message: 'Something went wrong while validating the token',
        });
    }
};


//isStudent
exports.isStudent = async (req, res, next) => {
 try{
        if(req.user.accountType !== "Student") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Students only',
            });
        }
        next();
 }
 catch(error) {
    return res.status(500).json({
        success:false,
        message:'User role cannot be verified, please try again'
    })
 }
}


//isInstructor
exports.isMessStaff = async (req, res, next) => {
    try{
           if(req.user.role !== "Mess") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for MessStaff only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }


//isAdmin
exports.isAdmin = async (req, res, next) => {
    try{    
           console.log("Printing AccountType ", req.user.accountType);
           if(req.user.accountType !== "Admin") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Admin only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }