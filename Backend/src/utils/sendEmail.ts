import nodemailer from "nodemailer";
import {
  verifyEmailTemplate,
  orderConfirmationTemplate,
} from "../utils/emailTemplates";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async (to: string, token: string) => {
  try {
    const transporter = createTransporter();

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Verify Your FoodHub Account",
      html: verifyEmailTemplate(verifyUrl),
    });
  } catch (error: any) {
    console.error("Verify email failed", error.message);
  }
};

export const sendOrderEmail = async (to: string, order: any) => {
  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Your FoodHub Order Confirmation",
      html: orderConfirmationTemplate(order),
    });
    console.log("Order email sent to:", to);
  } catch (error: any) {
    console.error("Order email failed", error.message);
  }
};
