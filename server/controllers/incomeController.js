const Income=require("../models/IncomeModel");
const asyncHandler=require("express-async-handler");
const ErrorHandler = require("../utils/errorHandler");

//CREATE Income

const addIncome= asyncHandler(async(req,res,next)=>{

    const {title,amount,category,date,description}=req.body;

    if(!title||!amount||!category||!date){
        return next(new ErrorHandler("All Fields are manditory!",400));
    }

    if(amount<0||!amount==='number'){
       return next(new ErrorHandler("amt should be greater than zero!",400));
    }

    const income=await Income.create({
      title,
      amount,
      category,
      date,
      description,
      user_id:req.user.id
    });

    await income.save();
    
    res.status(201).json({
    success:true,
    income
  });

});


//GET_ALL_Incomes
const getIncome=asyncHandler(async(req,res)=>{

    const incomes=await Income.find({user_id:req.user.id});
    res.status(200).json({
        success:true,
        incomes
    });

});


//EDIT AN Income
const updateIncome=asyncHandler(async(req,res,next)=>{

      let income=await Income.findById(req.params.id);
      if(!income){
       return next(new ErrorHandler("Income not found!",404));
      }

      if(income.user_id.toString()!==req.user.id){
        return next(new ErrorHandler("User dont have permission to update other users transactions",403));
      }
      
      const updatedIncome=await Income.findByIdAndUpdate(req.params.id, req.body, {new:true});
      res.status(200).json({ 
        success:true,
        updatedIncome
      });

});

//DELETE_AN_INCOME
const deleteIncome=asyncHandler(async(req,res,next)=>{

    let income=await Income.findById(req.params.id);
      if(!income){
        return next(new ErrorHandler("Income not found!",404));
      }

      if(income.user_id.toString()!==req.user.id){
        return next(new ErrorHandler("User dont have permission to delete other users transactions",403));
      }
      
     await Income.deleteOne({_id:req.params.id});
     res.status(200).json({
      success:true,
      income
    });

});


module.exports={getIncome,addIncome,updateIncome,deleteIncome};