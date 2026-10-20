
if(!process.env.JWT_SECRET){
    console.log("jwt secret not provided");
}
if(!process.env.MONGODB_URI){
    console.log("mongodb database url not provided");
}

if(!process.env.GOOGLE_CLIENT_ID){
    console.log("google client id not found");
}

if(!process.env.GOOGLE_CLIENT_SECRET){
    console.log("google client secret not found");
}
if(!process.env.GOOGLE_CALLBACK_URL){
    console.log("google callback url not found");
}
if(!process.env.GOOGLE_REFRESH_EMAIL_KEY){
    console.log("google refresh email key not found");
}
if(!process.env.GOOGLE_EMAIL_USER){
    console.log("google email user not found");
}

export const config={
    PORT:process.env.PORT ||3000,
    JWT_SECRET_KEY:process.env.JWT_SECRET,
    MONGODB_URI:process.env.MONGODB_URI,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL:process.env.GOOGLE_CALLBACK_URL,
    GOOGLE_REFRESH_EMAIL_KEY:process.env.GOOGLE_REFRESH_EMAIL_KEY,
    GOOGLE_EMAIL_USER:process.env.GOOGLE_EMAIL_USER
}