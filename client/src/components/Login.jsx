import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "motion/react";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Login");
  const { setIsLogin, backendUrl, setUser } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("form submitted");
    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "api/auth/login", {
          email,
          password,
        },{withCredentials:true});

        if (data.success) {
          setUser(data.user);
          toast.success("Login Successfull");
          setTimeout(() => {
    setIsLogin(false);
  }, 100)
console.log("Cookies:", document.cookie); // See if `jwt` is visible

          
        } else {
          toast.error(data.message);
          setEmail("");
          setPassword("");
        }
      } else {
        const { data } = await axios.post(backendUrl + "api/auth/signup", {
          name,
          email,
          password,
        },{withCredentials:true});
        if (data.success) {
          setUser(data.user);

          setIsLogin(false);
          toast.success("Signup Successfull");
        } else {
          toast.error(data.message);
          setName("");
          setEmail("");
          setPassword("");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
      setName("");
      setEmail("");
      setPassword("");
    }
  };
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <motion.form
        onSubmit={submitHandler}
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          {state}
        </h1>
        <p className="text-sm ">
          Welcome back! Please {state === "Login" ? "sign in" : "sign up"} to
          continue
        </p>

        {state !== "Login" && (
          <div className="border px-5 py-2 flex items-center gap-2 rounded-full mt-5">
            <img src={assets.profile_icon} alt="" width={25} />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="outline-none text-sm "
              type="text"
              placeholder="Full Name "
              required
            />
          </div>
        )}
        <div className="border px-5 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.email_icon} alt="" width={15} />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="outline-none text-sm "
            type="email"
            placeholder=" Email "
            required
            
          />
        </div>
        <div className="border px-5 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.lock_icon} alt="" width={10} />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="outline-none text-sm "
            type="password"
            placeholder="Password "
            required
            
          />
        </div>
        <p className="text-sm text-blue-600 my-4  text-center">
          Forgot Password?
        </p>
        <button className="bg-blue-600 text-white rounded-full text-sm py-2  w-full">
          {state === "Login" ? "Login" : "Create account"}
        </button>
        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Sign up")}
            >
              Sign up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Login")}
            >
              Login
            </span>
          </p>
        )}

        <img
          onClick={() => setIsLogin(false)}
          src={assets.cross_icon}
          alt=""
          className="absolute top-5 right-5 cursor-pointer"
        />
      </motion.form>
    </div>
  );
};

export default Login;
