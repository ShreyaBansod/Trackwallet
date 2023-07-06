const express=require("express");
const router=express.Router();
const {registerUser,loginUser,logoutUser,forgotPassword,resetPassword
    ,getUserDetails,updatePassword,updateProfile}=require("../controllers/userController");
const {isAuthenticatedUser}=require("../middleware/auth");


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logoutUser);
router.route("/me").get(isAuthenticatedUser,getUserDetails);
router.route("/password/update").put(isAuthenticatedUser,updatePassword);
router.route("/me/update").put(isAuthenticatedUser,updateProfile);

module.exports=router;