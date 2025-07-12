import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const { user, generateImg,credits } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
if(credits<=0){
    toast.warning("Low credit! Please buy more to generate images");
     return  navigate('/buy');
    
  }

  }, [user, navigate,credits]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (input) {
      const image = await generateImg(input);
      if (image) {
        setIsImageLoaded(true);
        setImage(image);
      }
    }
    setLoading(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0.3, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center min-h-[90vh]:"
    >
      <div className="mt-20">
        <div className="relative">
          <img src={image} alt="" className="w-sm rounded-lg " />
          <span
            className={`absolute bottom-0 left-0 h-1 bg-blue-500  ${
              loading ? "w-full transition-all duration-[10s]" : "w-0"
            }`}
          />
        </div>

        <p className={!loading ? "hidden" : ""}>Loading.....</p>
      </div>

      {!isImageLoaded && (
        <div className="flex  w-full max-w-xl bg-neutral-500 text-white rounded-full text-sm p-0.5 mt-10">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Describe what you want to generate"
            className="flex-1 w-full min-w-0 bg-transparent outline-none ml-4 sm:ml-8 placeholder:text-sm text-sm"
          />
          <button
            
            type="submit"
            disabled={credits <= 0}
            className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full "
          >
            Generate
          </button>
        </div>
      )}
      {isImageLoaded && (
        <div className="flex flex-wrap gap-2 justify-center text-white text-sm p-0.5 mt-10 rounded-full">
          <p
            onClick={() => {
              setIsImageLoaded(false);
            }}
            className="bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer"
          >
            Generate Another
          </p>
          <a
            download
            className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer"
            href={image}
          >
            Download
          </a>
        </div>
      )}
    </motion.form>
  );
};

export default Result;
