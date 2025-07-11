import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './src/lib/db.js';
import authRoute from './src/routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import imageRouter from './src/routes/image.routes.js';


const app=express();
const PORT=process.env.PORT || 5050;


app.use(express.json())
app.use(express.urlencoded({extended:true}))

const allowedOrigins = [
  "https://image-genearator-65vu.vercel.app",
   
];
app.use(cors({
    origin:allowedOrigins,
    credentials:true,
})
);
app.use(cookieParser())

app.use('/api/auth',authRoute)

app.use('/api/image',imageRouter)

app.get('/',(req,res)=>{
  res.send({
    message:"Welcome to the server",
    status:200,
    error:false,
    success:true
  })
})


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
  });
});
