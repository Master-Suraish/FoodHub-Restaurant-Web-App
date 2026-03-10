import nodemailer from "nodemailer";
import {
  verifyEmailTemplate,
  orderConfirmationTemplate,
} from "../utils/emailTemplates";

export const sendEmail = async (to: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verifyUrl = `http://localhost:5173/verify-email/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Verify Your FoodHub Account",
    html: verifyEmailTemplate(verifyUrl),
  });
};

export const sendOrderEmail = async (to: string, order: any) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Your FoodHub Order Confirmation",
    html: orderConfirmationTemplate(order),
  });
};
