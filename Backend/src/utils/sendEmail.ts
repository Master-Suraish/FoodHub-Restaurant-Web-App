//* -------- Backend Email Sending logic (NODEMAILER) --------
/* 
! Why is Backend Email (Nodemailer/Resend) commented out?
? 1. SMTP Port Restrictions: Most cloud providers (Railway/Render) block outgoing SMTP ports.
? 2. Domain Verification: Services like Resend require a verified custom domain to send to multiple recipients.
? 3. Solution: Implemented EmailJS on the Frontend to handle production-ready transactional emails without the need for a dedicated mail server or custom domain.
*/

// import nodemailer from "nodemailer";
// import {
//   verifyEmailTemplate,
//   orderConfirmationTemplate,
// } from "../utils/emailTemplates";

// export const sendEmail = async (to: string, token: string) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   // const verifyUrl = `http://localhost:3000/api/auth/verify-email/${token}`;
//   const verifyUrl = `http://localhost:5173/verify-email/${token}`;

//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to,
//     subject: "Verify Your FoodHub Account",
//     html: verifyEmailTemplate(verifyUrl),
//   });
// };

// export const sendOrderEmail = async (to: string, order: any) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to,
//     subject: "Your FoodHub Order Confirmation",
//     html: orderConfirmationTemplate(order),
//   });
// };
