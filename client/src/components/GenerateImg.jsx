import React,{useContext} from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const GenerateImg = () => {
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
      initial={{ opacity: 0.3, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pb-16 text-center"
    >
      <h1 className="text-2xl md:text-3xl lg:text-4xl  font-semibold text-neutral-800 py-2 md:py-16">
        See the magic. Try now
      </h1>
      <button onClick={onClickHandle} className="rounded-full inline-flex items-center gap-2 px-12 py-3 bg-black text-white m-auto hover:scale-105 transition-all duration-500">
        Generate Images
        <img src={assets.star_group} alt="" className="h-6" />
      </button>
    </motion.div>
  );
};

export default GenerateImg;
