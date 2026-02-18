import dotenv from "dotenv";
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({
    path: './.env'
})


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log("Server is running on port:", `${process.env.PORT || 8000}`);
    });

    app.on("error",(error)=>{
        console.log("error:",error);
        throw error
    })
})
.catch((err) => {
    console.error("Failed to connect to the database:", err);
})
// console.log(process.env.MONGO_URI)
