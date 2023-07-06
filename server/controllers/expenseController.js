const Expense=require("../models/ExpenseModel");
const asyncHandler=require("express-async-handler");
const ErrorHandler = require("../utils/errorHandler");

//CREATE EXPENSE

const addExpense= asyncHandler(async(req,res,next)=>{

    const {title,amount,category,date,description}=req.body;

    if(!title||!amount||!category||!date){
        return next(new ErrorHandler("All Fields are manditory!",400));
    }

    if(amount<0||!amount==='number'){
       return next(new ErrorHandler("amt should be greater than zero!",400));
    }

    const expense=await Expense.create({
      title,
      amount,
      category,
      date,
      description,
      user_id:req.user.id
    });

    await expense.save();
    
    res.status(201).json({
    success:true,
    expense
  });

});


//GET_ALL_EXPENSES
const getExpense=asyncHandler(async(req,res)=>{

    const expenses=await Expense.find({user_id:req.user.id});
    res.status(200).json({
        success:true,
        expenses
    });

});


//EDIT AN EXPENSE
const updateExpense=asyncHandler(async(req,res,next)=>{

      let expense=await Expense.findById(req.params.id);
      if(!expense){
       return next(new ErrorHandler("Expense not found!",404));
      }

      if(expense.user_id.toString()!==req.user.id){
        return next(new ErrorHandler("User dont have permission to update other users transactions",403));
      }
      
      const updatedExpense=await Expense.findByIdAndUpdate(req.params.id, req.body, {new:true});
      res.status(200).json({ 
        success:true,
        updatedExpense
      });

});

//DELETE_AN_EXPENSE
const deleteExpense=asyncHandler(async(req,res,next)=>{

    let expense=await Expense.findById(req.params.id);
      if(!expense){
        return next(new ErrorHandler("Expense not found!",404));
      }

      if(expense.user_id.toString()!==req.user.id){
        return next(new ErrorHandler("User dont have permission to delete other users transactions",403));
      }
      
     await Expense.deleteOne({_id:req.params.id});
     res.status(200).json({
      success:true,
      expense
    });

});


module.exports={getExpense,addExpense,updateExpense,deleteExpense};