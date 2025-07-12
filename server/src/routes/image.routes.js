import express from 'express';
import protectRoute from '../middleware/protectAuth.js';
import { generateImage } from '../controllers/imageGenerate.js';

const imageRouter=express.Router();

imageRouter.post('/generate-image',protectRoute,generateImage);

export default imageRouter;