import 'dotenv/config'
import app from "./src/app.js";
import connectToDb from './src/config/database.js';
import { config } from './src/config/config.js';

connectToDb();
app.listen(config.PORT,()=>{
    console.log(`server is running on ${config.PORT} `);
})