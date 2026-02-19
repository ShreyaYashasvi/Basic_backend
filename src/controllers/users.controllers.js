import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import { User } from '../models/users.models.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import fs from 'fs';

const registerUser = asyncHandler(async (req,res)=>{
   
const{fullname,email,username,password}=req.body
if([fullname,email,username,password].some((field)=>field?.trim()==="")){
    throw new ApiError(400,"all field  is required")
}

const existedUser=await User.findOne({$or:[{email},{username}]})
if(existedUser){
     if (req.files) {
            Object.values(req.files).forEach(fileArray => {
                fileArray.forEach(file => fs.unlinkSync(file.path));
            });
        }
    throw new ApiError(409,"user already exist with this email or username")}

const avatarLocalPath=req.files?.avatar?.[0]?.path;
const coverImageLocalPath=req.files?.coverImage?.[0]?.path;

if (!avatarLocalPath) {
    throw new ApiError(400,"avatar image is required")
}
const avatar = await uploadToCloudinary(avatarLocalPath)
const coverImage=await uploadToCloudinary(coverImageLocalPath)

if(!avatar){
     throw new ApiError(400,"avatar image is not there")
    console.log("avatar path:",avatarLocalPath);}



const newUser=await User.create({
    fullname,
    email,
    username:username.toLowerCase(),
    password,
    avatar:avatar.url,  
    coverImage:coverImage?.url||"",
    watchHistory:[],
})


const createdUser=await User.
findById(newUser._id).
select("-password  -refreshToken")


if( !createdUser){
    throw new ApiError(500,"something went wrong")
 }

 return res.status(201).json(new ApiResponse(200,"user registered successfully",createdUser))

})


export {registerUser}