const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");

const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,"Please enter your name"],
        maxLength:[30,"Name cannot exceed 30 characters"],
        minLength:[4,"name should have more than 4 charcaters"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"Enter your password"],
        minLength:[8,"Password should be greater than 8 caharcters"],
        select:false       
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});


//Pre used for before saving the password and ()=> cant use this method so instead func
userSchema.pre("save",async function(next){

    //if password is changed it will check this condition 
    //(in profile update all we want to update is name and email 
    //it will hash the hashed password if if-condition not used)

    if(!this.isModified("password")){    
        next();
    }

    this.password=await bcrypt.hash(this.password,10);
});

//JWT TOKEN(we will generate and save the token in cookie)
//so server will understand that the user is registered and can access routes

userSchema.methods.getJWTToken=function(){  
    return jwt.sign({ id:this._id },process.env.JWT_SECRET,{   //give payload to jwt
        expiresIn:process.env.JWT_EXPIRE,
    }) ;
};

//Compare Password
userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

//Generating password reset token
userSchema.methods.getResetPasswordToken=function(){
     //Generating Token
     const resetToken=crypto.randomBytes(20).toString("hex");

     //Hashing and adding to user schema
     this.resetPasswordToken=crypto
     .createHash("sha256")
     .update(resetToken)
     .digest("hex");

     this.resetPasswordExpire=Date.now()+15*60*1000;

     return resetToken;
};


module.exports=mongoose.model("User",userSchema);