import axios from "axios";
axios.defaults.withCredentials = true;

import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [credits, setCredits] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050/";

  const getCredits = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}api/auth/credits`,{withCredentials:true});
      
      if (data.success) {
        setCredits(data.credits);
        setUser((prev) => ({ ...prev, credits: data.credits }));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Unauthorized");
    }
  };

  const generateImg = async (prompt) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}api/image/generate-image`,
        { prompt },{withCredentials:true}
      );
      if (data.success) {
        getCredits();
        return data.resultImage;
      } else {
        toast.error(data.message || "Image generation failed");
        getCredits();
        if (data.credits === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}api/auth/verify`,{withCredentials:true});
        
        if (data.success) {
          setUser(data.user);
          
         await getCredits();
        }
      } catch (error) {
        console.log("User not logged in");
        setUser(null);
        setIsLogin(false);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  useEffect(() => {
    if (isLogin && user) {
      getCredits();
    }
  }, [isLogin]);

  const value = {
    user,
    setUser,
    isLogin,
    setIsLogin,
    backendUrl,
    generateImg,
    credits,
    getCredits,
    loading,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
