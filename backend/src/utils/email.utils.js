import { sendEmail } from "../services/email.services.js";

export async function emailSendFromServer(recipientEmail,verificationToken){
    // 1. Define the user and the unique verification token/URL
    // const recipientEmail = "user@example.com";
    // const verificationToken = "abc123xyz789"; // Usually generated dynamically using JWT or crypto
    // const verificationLink = `https://yourdomain.com{verificationToken}`;
    const verificationLink = `http://localhost:3000/api/auth/verify-user?id=${verificationToken}`;

    // 2. Draft the Email Content
    const subject = "Verify Your Email Address";

    // Plain text fallback (for basic email clients)
    const textBody = `Hello, Please verify your email by copying and pasting this link into your browser: ${verificationLink}`;

    // Beautiful HTML with a clickable button
    const htmlBody = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Verify Your Email</h2>
            <p>Thank you for registering! Please click the button below to verify your email address and log in to your account.</p>
            
            <div style="margin: 30px 0;">
                <a href="${verificationLink}" 
                style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                Verify & Log In
                </a>
            </div>
            
            <p style="font-size: 12px; color: #777;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${verificationLink}" target="_blank">${verificationLink}</a>
            </p>
            <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;">
            <p style="font-size: 12px; color: #999;">This link will expire in 1 hour.</p>
        </div>
    `;

    // 3. Call your function
    await sendEmail(recipientEmail, subject, textBody, htmlBody)
    .then(() => console.log("Verification email sent!"))
    .catch((err) => console.error("Failed to send verification email:", err));

}