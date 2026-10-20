import express from 'express'
import authRouter from './routes/auth.routes.js';
import cookiePaser from 'cookie-parser'
import passport from 'passport'
import morgan from 'morgan'

const app=express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cookiePaser());
app.use(passport.initialize());

app.use('/api/auth',authRouter);


app.use((err, req, res, next) => {
    //console.error(err.stack); // Log the error details for debugging

    const statusCode = err.statusCode || 500; // Default to 500 Internal Server Error
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        error: message
    });
});

export default app;