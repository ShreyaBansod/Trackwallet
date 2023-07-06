const mongoose=require("mongoose");
const  IncomeSchema=new mongoose.Schema({

    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },

    title:{
        type:String,
        required: [true,"Enter the title"],
        trim: true,
        maxLength:[20,"cannot exceed beyond 20 characters"]
    },

    amount:{
        type:Number,
        required:[true,"Enter the amount"],
        maxLength:[8,"cannot exceed beyond 8 characters"],
        trim:true
    },

    date:{
        type:Date,
        required:[true,"Enter the date"],
        trim:true
    },

    category:{
        type:String,
        required:[true,"Enter the category"],
        trim:true
    },

    description:{
        type:String,
        required:true,
        maxLength:[50,"cannot exceed beyond 50 characters"],
        trim:true
    },

    type:{
        type:String,
        default:"Income"
    },   
},{
    timestamps:true
})

module.exports=mongoose.model("Income",IncomeSchema);