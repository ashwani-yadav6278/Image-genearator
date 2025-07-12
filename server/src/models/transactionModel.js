import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema({
  userId: {type: String,required: true,},
  credits: {type: Number,required: true,},
  plan: {type: String,required: true,},
  amount: {type: Number,required: true,},
  paymet:{type:Boolean,default:false},
  date:{type:Number},
});

const transaction = new mongoose.model("Transaction", transactionSchema);
export default transaction;
