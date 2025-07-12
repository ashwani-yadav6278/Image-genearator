import express from 'express';
import { registerUser,loginUser,logOut,userCredits,checkAuth, paymentInerface,verifyPaymentRazorPay } from '../controllers/user.controller.js';
import protectRoute from '../middleware/protectAuth.js';

const router=express.Router();

router.post("/signup",registerUser)
router.post("/login",loginUser)
router.post("/logout",logOut)
router.get('/credits',protectRoute,userCredits)
router.get('/verify',protectRoute,checkAuth)
router.post('/pay-razorpay',protectRoute,paymentInerface)
router.post('/verify/pay-razorpay',verifyPaymentRazorPay)
export default router;