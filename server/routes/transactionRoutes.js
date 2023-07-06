const express=require("express");
const router=express.Router();
const {getExpense,addExpense,updateExpense,deleteExpense}=require("../controllers/expenseController");
const {getIncome,addIncome,deleteIncome,updateIncome}=require("../controllers/incomeController");
const {isAuthenticatedUser}=require("../middleware/auth");

router.route("/get-expenses").get(isAuthenticatedUser,getExpense);
router.route("/add-expenses").post(isAuthenticatedUser,addExpense);
router.route("/delete-expense/:id").delete(isAuthenticatedUser,deleteExpense);
router.route("/update-expense/:id").put(isAuthenticatedUser,updateExpense);

router.route("/get-incomes").get(isAuthenticatedUser,getIncome);
router.route("/add-incomes").post(isAuthenticatedUser,addIncome);
router.route("/delete-income/:id").delete(isAuthenticatedUser,deleteIncome);
router.route("/update-income/:id").put(isAuthenticatedUser,updateIncome);


module.exports=router;