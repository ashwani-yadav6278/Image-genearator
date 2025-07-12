import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { Menu, X } from "lucide-react"; // npm i lucide-react

const Navbar = () => {
  const { user, setIsLogin, setUser, backendUrl } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}api/auth/logout`, null, {
        withCredentials: true,
      });

      if (data.success) {
        setUser(null);
        setIsLogin(false);
        toast.success("User logged out successfully");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md px-4 py-3 rounded-xl">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img src={assets.logo} alt="logo" className="w-28" />
        </Link>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <button
                onClick={() => navigate("/buy")}
                className="flex items-center gap-2 bg-white border border-blue-300 shadow-sm px-4 py-2 rounded-full hover:shadow-md transition-all"
              >
                <img src={assets.credit_star} alt="credits" className="w-2" />
                <p className="text-sm font-semibold text-blue-700">
                  Credits left:{user?.credits ?? 0}
                </p>
              </button>
              <p className="text-gray-700 font-medium">Hi, {user.name}</p>
              <img src={assets.profile_icon} alt="profile" className="w-8" />
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <p
                onClick={() => navigate("/buy")}
                className="cursor-pointer text-gray-600"
              >
                Pricing
              </p>
              <button
                onClick={() => setIsLogin(true)}
                className="bg-zinc-800 text-white px-5 py-2 rounded-full text-sm"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Collapse Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col items-start gap-4">
          {user ? (
            <>
              <button
                onClick={() => navigate("/buy")}
                className="flex items-center gap-2 bg-white border border-blue-300 shadow-sm px-4 py-2 rounded-full hover:shadow-md transition-all w-full"
              >
                <img src={assets.credit_star} alt="credits" className="w-4" />
                <p className="text-sm font-semibold text-blue-700">
                  Credits: {user.credits}
                </p>
              </button>
              <p className="text-gray-700 font-medium">Hi, {user.name}</p>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded-full text-sm w-full text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <p
                onClick={() => navigate("/buy")}
                className="cursor-pointer text-gray-600"
              >
                Pricing
              </p>
              <button
                onClick={() => setIsLogin(true)}
                className="bg-zinc-800 text-white px-5 py-2 rounded-full text-sm"
              >
                Login
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
