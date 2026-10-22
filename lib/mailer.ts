import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },

            connectionTimeout: 5000,
            greetingTimeout: 5000,
            socketTimeout: 5000,
        });


        const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;

        console.log("==================================================");
        console.log("NEW USER REGISTERED! Verification Link:");
        console.log(verificationUrl);
        console.log("==================================================");

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your Breast Cancer AI Dashboard Account",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f5; color: #171717;">
          <h2 style="color: #0d9488;">Welcome to BreastCancer AI</h2>
          <p>Please verify your email address to access the dashboard by clicking the button below:</p>
          <a href="${verificationUrl}" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Verify Email</a>
          <p style="margin-top: 20px; font-size: 12px; color: #52525b;">If the button doesn't work, copy this link: <br> ${verificationUrl}</p>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully!");
    } catch (error: any) {
        console.error("Warning: Could not send verification email over the network (likely an IPv6 issue).");
        console.error("The user was still created successfully in the database.");
        console.error("Please click the verification link printed above to verify the account manually!");
    }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

        console.log("==================================================");
        console.log("PASSWORD RESET REQUESTED! Reset Link:");
        console.log(resetUrl);
        console.log("==================================================");

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Reset your Breast Cancer AI Dashboard Password",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f5; color: #171717;">
          <h2 style="color: #0d9488;">Password Reset Request</h2>
          <p>You requested to reset your password. Click the button below to set a new password:</p>
          <a href="${resetUrl}" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Reset Password</a>
          <p style="margin-top: 20px; font-size: 12px; color: #52525b;">If you did not request this, please ignore this email. <br> Or copy this link: <br> ${resetUrl}</p>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully!");
    } catch (error: any) {
        console.error("Warning: Could not send password reset email over the network (likely an IPv6 issue).");
        console.error("Please click the reset link printed above to reset the password manually!");
    }
};
