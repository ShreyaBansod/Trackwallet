const express=require("express");
const app=express();
const cookieparser=require("cookie-parser");

const errorMiddleware=require("./middleware/errors");

app.use(express.json());
app.use(cookieparser());
//Importing Routes
const Expense=require("./routes/transactionRoutes");
const user=require("./routes/userRoutes");

app.use("/api/v1",Expense);
app.use("/api/v1",user)

//MiddleWare
app.use(errorMiddleware);

module.exports=app;