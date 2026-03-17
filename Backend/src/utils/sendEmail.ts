import nodemailer from "nodemailer";
import { Resend } from "resend";
// import dotenv from "dotenv";
// dotenv.config();

import {
  verifyEmailTemplate,
  orderConfirmationTemplate,
  adminVerifyUserTemplate,
} from "../utils/emailTemplates";

// (async function () {
//   const resend = new Resend(process.env.RESEND_API_KEY);
//   const { data, error } = await resend.emails.send({
//     from: "Email by Resend <onboarding@resend.dev>",
//     to: [process.env.EMAIL_USER as string],
//     subject: "Hello World",
//     html: "<strong>It works!</strong>",
//   });

//   if (error) {
//     return console.error({ error });
//   }

//   console.log({ data });
// })();

// export const notifyAdminOfSignup = async (
//   name: string,
//   to: string,
//   token: string,
// ) => {
//   try {
//     const resend = new Resend(process.env.RESEND_API_KEY);

//     const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

//     const { data, error } = await resend.emails.send({
//       from: "Email by Resend <onboarding@resend.dev>",
//       to: [process.env.EMAIL_USER as string],
//       subject: `New Signup Request from ${name}`,
//       html: adminVerifyUserTemplate(name, to, verifyUrl),
//     });

//     if (error) {
//       return console.error({ error });
//     } else {
//       console.log({ data });
//     }
//     console.log(`Your verify email send to admin:  ${to}`);
//   } catch (error: any) {
//     console.error("Failed to send verify email to admin ", error.message);
//   }
// };

// sendEmail("another@gmail.com","abc")
// export const sendEmail = async (to: string, token: string) => {
//   try {
//     const resend = new Resend(process.env.RESEND_API_KEY);
//     const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
//     const { data, error } = await resend.emails.send({
//       from: "Website <website@resend.dev>",
//       to: [to],
//       subject: "Verify Your FoodHub Account",
//       html: "email verify",
//     });
//     if (error) {
//       return console.error({ error });
//     } else {
//       console.log(data);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const sendOrderEmail = async (to: string, order: any) => {
//   try {
//     // const transporter = createTransporter();

//     // await transporter.sendMail({
//     //   from: process.env.EMAIL_USER,
//     //   to,
//     //   subject: "Your FoodHub Order Confirmation",
//     //   html: orderConfirmationTemplate(order),
//     // });
//     const resend = new Resend(process.env.RESEND_API_KEY);
//     await resend.emails.send({
//       from: process.env.EMAIL_USER as string,
//       to,
//       subject: "Your FoodHub Order Confirmation",
//       html: orderConfirmationTemplate(order),
//     });
//     console.log("Order email sent to:", to);
//   } catch (error: any) {
//     console.error("Order email failed", error.message);
//   }
// };
