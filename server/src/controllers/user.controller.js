import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import bcrypt from "bcrypt";
import 'dotenv/config';

import generateToken from "../lib/jsonToken.js";
import razorpay from "razorpay";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      const token = generateToken(newUser._id, res);
      await newUser.save();
      res.status(200).json({
        success: true,
        token,
        message: "Signup successful",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          credits: newUser.credits,
        },
      });
    } else {
      return res.status(400).json({ msg: "Failed to create user" });
    }
  } catch (error) {
    console.log("Error in register Controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    console.log("Response received")
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
    const token = generateToken(user._id, res);
    res.status(200).json({
      success: true,
      message: "User Login successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
      },
    });
  } catch (error) {
    console.log("Error in login controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logOut = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in LogOut Controller", error.msg);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const userCredits = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    res.status(200).json({
      success: true,
      credits: user.credits,
      user: { name: user.name },
    });
  } catch (error) {
    console.log("Error in userCredits Controller", error.msg);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const razorpayInstance = new razorpay({
  
  key_id: process.env.R_PAY_KEY_ID?.trim(),
  key_secret: process.env.R_PAY_KEY_SECRET?.trim(),
});

export const paymentInerface = async (req, res) => {
  try {
    const userId = req.user._id;
    const { planId } = req.body;
    console.log(planId, "userid:", userId);

    if (!userId || !planId) {
      return res
        .status(404)
        .json({ success: false, message: "User or plan id not found" });
    }

    let credits, plan, amount, date;
    switch (planId) {
      case "Basic":
        (plan = "Basic"), (credits = 100), (amount = 10);
        break;

      case "Advanced":
        (plan = "Advanced"), (credits = 600), (amount = 50);
        break;

      case "Business":
        (plan = "Business"), (credits = 5000), (amount = 250);
        break;

      default:
        return res.json({ success: false, message: "Plan not Found" });
    }
    date = Date.now();
    // store transaction data
    const transactionData = {
      userId,
      plan,
      amount,
      credits,
      date,
    };

    const newTransaction = await Transaction.create(transactionData);
    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: newTransaction._id,
    };

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        res.status(400).json({
          success: false,
          message: "Error occurs in razorpayInstance",
        });
      } else {
        res.status(200).json({ success: true, order });
      }
    });
  } catch (error) {
    console.log("error in paymentInterface  Controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server error!" });
  }
};

export const verifyPaymentRazorPay = async (req, res) => {
  try {

    const { razorpay_order_id } = req.body.response;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if(orderInfo.status==='paid'){
      const transactionData=await Transaction.findById(orderInfo.receipt)
      if(transactionData.payment){
        return res.status(400).json({success:false,message:"Payment Failed"})
      }

      const userData=await User.findById(transactionData.userId);
      const newCredits=userData.credits + transactionData.credits;
      await User.findByIdAndUpdate(userData._id,{credits:newCredits})
      await Transaction.findByIdAndUpdate(transactionData._id,{payment:true})
      res.status(201).json({success:true,message:"Credits added"})
    }else{
      res.status(401).json({success:false,message:"Payment Failed"})
    }
  } catch (error) {
    console.log("Error in  VerifyPayment razorPay controller",error.message);

    res.status(500).json({success:false,message:"Internal server Error"})
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = req.user;
    if(!user)return res.status(404).json({message:"User not found!"});
      
    res.status(200).json({
      success: true,
      user, 
    });
  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
