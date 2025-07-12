import React from 'react'
import { assets, testimonialsData } from '../assets/assets'
import { motion } from 'motion/react'

const Testimonials = () => {
  return (
    <motion.div 
    initial={{ opacity: 0.3, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    
    className='flex flex-col items-center justify-center my-5 py-12  '>
        <h1 className='text-3xl text-center sm:text-4xl font-semibold mb-2 '>Customer Testimonials </h1>
        <p className='text-gray-500 mt-2 mb-5 text-center'>What Our Users Are Saying</p>

        <div className='flex flex-wrap gap-6'>
            {testimonialsData.map((testimonial,index)=>(
                <div key={index} className='bg-white/40 rounded-lg p-12 shadow-md border w-74 m-auto cursor-pointer hover:scale-[1.05] transition-all duration-300'>
                    <div className='flex flex-col items-center   mb-4'>
                        <img src={testimonial.image} alt="" className='w-14 rounded-full '/>
                        <h2 className='text-xl font-semibold mt-3'>{testimonial.name}</h2>
                        <p className='text-gray-600 mb-2'>{testimonial.role}</p>

                        <div className='flex '>
                            {Array(testimonial.stars).fill().map((item,index1)=>(
                                <img key={index1} src={assets.rating_star} alt="" />
                            ))}
                        </div>
                        <p className='text-center text-sm text-gray-600'>{testimonial.text}</p>

                    </div>
                </div>
            ))}
        </div>
      
    </motion.div>
  )
}

export default Testimonials
