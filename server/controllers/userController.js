const Expense=require("../models/ExpenseModel");
const asyncHandler=require("express-async-handler");
const User=require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendToken=require("../utils/sendJWTtoken");
const sendEmail=require("../utils/sendEmail");
const crypto=require("crypto");

//Register a User
const registerUser=asyncHandler(async(req,res,next)=>{
   const {name,email,password}=req.body;

   if(!name||!email||!password){
      return next(new ErrorHandler("All fields are manditory",400));
   }

   const user= await User.create({
     name,
     email,
     password
   });

   sendToken(user,201,res);

});


//LOGIN USER
const loginUser=asyncHandler(async(req,res,next)=>{
   
    const {email,password}=req.body;
    if(!email||!password){
        return next(new ErrorHandler("Please Enter Email and Password!",400))
    }

    const user=await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    const isPasswordMatched=await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }

   sendToken(user,200,res);
});


//LogoutUser
const logoutUser=asyncHandler(async(req,res,next)=>{
    
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    });

    res.status(200).json({
        success:true,
        message:"Logged Out",
    })
});

//Forgot Password
const forgotPassword=asyncHandler(async(req,res,next)=>{
     
    const user=await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    //Get reset password token
    const resetToken= user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    
    const message=`your reset password token is: \n\n ${resetPasswordUrl} \n\nIf 
    you have not requested this email then, please ignore it`;

    try{
     
      await sendEmail({
          email:user.email,
          subject:`Expense Tracker Transaction recovery`,
          message,
      });

      res.status(200).json({
        success:true,
        message:`Email sent to ${user.email} successfully`,
      });

    }catch(error){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;

        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message,500));
    }
    
});



//RESET PASSWORD
const resetPassword=asyncHandler(async(req,res,next)=>{

    //creating token hash
    const resetPasswordToken=crypto
     .createHash("sha256")
     .update(req.params.token)
     .digest("hex");

     const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
     });

     if(!user){
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired",404));
    }

    if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHandler("Password and confirm Password dont match",404));
    }

    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();

    sendToken(user,200,res);

});


//GET USER DETAILS
const getUserDetails=asyncHandler(async(req,res,next)=>{
    
    const user=await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    });

});

//UPDATE User Password
const updatePassword=asyncHandler(async(req,res,next)=>{
    
    const user=await User.findById(req.user.id).select("+password");

    const isPasswordMatched=await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect",400));
    }

    if(req.body.newPassword!==req.body.confirmPassword){
        return next(new ErrorHandler("Password doesnt match",400));
    }

    user.password=req.body.newPassword;
    await user.save();
    
    sendToken(user,200,res);

});


//UPDATE User Profile
const updateProfile=asyncHandler(async(req,res,next)=>{
    
    const newUserData={
        name:req.body.name,
        email:req.body.email,
    }

    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    
    res.status(200).json({
        success:true,
    });

});


module.exports={registerUser,loginUser,logoutUser,forgotPassword,resetPassword
    ,getUserDetails,updatePassword, updateProfile};