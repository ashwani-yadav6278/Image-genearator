import React, { useContext } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const BuyCredit = () => {
  const { user, backendUrl, getCredits, setIsLogin } = useContext(AppContext);
  const navigate = useNavigate();
   
  const initPay = async (order) => {
    if (typeof window.Razorpay === "undefined") {
      toast.error("Razorpay SDK not loaded");
      return;
    }

    const options = {
      key: import.meta.env.VITE_R_PAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Credits Payment",
      description: "Credits Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log("Payment success:", response);
        // TODO: Call backend to update payment status and user credits
        try {
          const {data}=await axios.post(`${backendUrl}api/auth/verify/pay-razorpay`,{response},{withCredentials:true});
          if(data.success){
            getCredits();
            navigate("/");
            toast.success("Credits added successfully");
          }
        } catch (error) {
          console.log("Error in verify payment client in buyCredit ",error.message)
          toast.error(error?.response?.data?.message || error.message)
        }

      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  const razorPayPayment = async (planId) => {
    console.log("plan Clicked", planId);
    try {
      if (!user) {
        setIsLogin(true);
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}api/auth/pay-razorpay`,
        { planId },
        { withCredentials: true }
      );

      if (data.success) {
        initPay(data.order);
      }
    } catch (error) {
      console.error("Razorpay error:", error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.3, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="min-h-[80vh] text-center pt-14 mb-10 "
    >
      <button className="border border-gray-400 px-10 py-2 rounded-full mb-6">
        Our Plans
      </button>
      <h1 className="text-center text-3xl font-medium mb-6 sm:mb-10">
        Choose the plan
      </h1>

      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((item, index) => (
          <div
            className="bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500"
            key={index}
          >
            <img src={assets.logo_icon} alt="" width={40} />
            <p className="mt-3 mb-1 font-semibold">{item.id}</p>
            <p className="text-sm">{item.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">${item.price} </span>/{" "}
              {item.credits}{" "}
            </p>
            
            <button
              onClick={() => {
                
                razorPayPayment(item.id);
              }}
              className="w-full bg-gray-800 text-white mt-8 text-sm rounded-lg py-2.5 min-w-52"
            >
              {" "}
              {user ? "Purchase" : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BuyCredit;
