import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // uses Gmail, not custom SMTP host
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // use app password here
  },
});

export const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"AI Support System" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP for account verification",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for <strong>10 minutes</strong>.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (to, username) => {
  const mailOptions = {
    from: `"AI Support System" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to AI Support System 🎉",
    text: `Thanks ${username} for creating your account!`,
    html: `<p>Thanks <strong>${username}</strong> for creating your account! We're excited to have you on board.</p>`,
  };

  await transporter.sendMail(mailOptions);
};