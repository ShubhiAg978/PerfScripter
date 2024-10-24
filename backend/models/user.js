import mongoose from "mongoose"

//create schema
const userSchema = new mongoose.Schema({
    name: String, 
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        select: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }

  })
  
export const User = mongoose.model("Users", userSchema)