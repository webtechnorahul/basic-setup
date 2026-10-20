import mongoose from 'mongoose';
import { config } from './config.js';

async function connectToDb(){
    await mongoose.connect(config.MONGODB_URI);
    console.log("database is connected")
}
export default connectToDb