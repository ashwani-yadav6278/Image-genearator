import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Header = () => {

const {user,setIsLogin}=useContext(AppContext)
const navigate=useNavigate()
const onClickHandle=()=>{
   if(user){
      navigate('/result')
   }else{
      setIsLogin(true)
   }
}

  return (
    <motion.div
      className="flex flex-col justify-center items-center text-center my-20"
      initial={{ opacity: 0.3, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-stonne-500 inline-flex gap-2 px-6 py-1 border border-neutral-500 rounded-full bg-white text-center"
      >
        <p>Best text to image generator</p>
        <img src={assets.star_icon} alt="" />
      </motion.div>
      <motion.h1 className="text-4xl max-w-[300px] sm:text-7xl sm:max-w-[590px] mx-auto mt-10 text-center"
         initial={{opacity:0}}
    transition={{duration:2,delay:0.4}}
    animate={{opacity:1}}
      >
        Turn text to <span className="text-blue-600">image</span>, in seconds.
      </motion.h1>

      <motion.p className="text-center max-w-xl mx-auto mt-5"
      initial={{opacity:0,y:20}}
      transition={{duration:0.8,delay:0.6}}
      animate={{opacity:1,y:0}}
      >
        Unleash your creativity with AI. Turn your imagination into visual art
        in seconds - just type and watch the magic happen.
      </motion.p>

      <motion.button onClick={onClickHandle}
      whileHover={{scale:1.05}}
      whileTap={{scale:0.95}}
      initial={{opacity:0}}
      transition={{default:{duration:0.5},opacity:{delay:0.8,duration:1}}}
      animate={{opacity:1}}
      className="flex items-center bg-black text-white rounded-full  px-12 py-2.5 mt-8 sm:text-lg gap-2 w-auto ">
        Generate images
        <img src={assets.star_group} alt="" className="size-6" />
      </motion.button>

      <motion.div 
      initial={{opacity:0}}
      transition={{duration:1,delay:1}}
      animate={{opacity:1}}
      className="flex flex-wrap gap-3 mt-16 justify-center">
        {Array(6)
          .fill(" ")
          .map((item, index) => (
            <motion.img
            whileHover={{scale:1.05,duration:0.1}}
              className="rounded-lg hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-10"
              src={index % 2 === 0 ? assets.sample_img_2 : assets.sample_img_1}
              alt=""
              width={100}
              key={index}
            />
          ))}
      </motion.div>
      <motion.p
      initial={{opacity:0}}
      transition={{duration:0.8,delay:1.2}}
      animate={{opacity:1}}
      className="text-lg text-neutral-600 mt-2">
        {" "}
        Generated images from Imagify
      </motion.p>
    </motion.div>
  );
};

export default Header;
