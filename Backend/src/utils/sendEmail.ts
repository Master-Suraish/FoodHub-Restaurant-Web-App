import nodemailer from "nodemailer";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
import {
  verifyEmailTemplate,
  orderConfirmationTemplate,
} from "../utils/emailTemplates";
import { google } from "googleapis";


const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI,
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function sendMail() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    } as any);

    const mailOptions = {
      from: "SURAISH <sureshkamar3000@gmail.com>",
      to: "box195925@gmail.com",
      subject: "Hello from gmail using google api",
      text: "Hello from google api",
      html: "<h1>Hello from google api</h1>",
    };

    const result = await transporter.sendMail(mailOptions);

    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

sendMail();

// const createTransporter = () => {
//   return nodemailer.createTransport({
//     service: "Gmail",
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     //   port: 587,
//     // secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
// };

export const sendEmail = async (to: string, token: string) => {
  try {
    // const transporter = createTransporter();
    const resend = new Resend(process.env.RESEND_API_KEY);

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    // await transporter.sendMail({
    //   from: process.env.EMAIL_USER,
    //   to,
    //   subject: "Verify Your FoodHub Account",
    //   html: verifyEmailTemplate(verifyUrl),
    // });

    await resend.emails.send({
      from: "Website <website@resend.dev>",
      to: [to],
      subject: "Verify Your FoodHub Account",
      html: "email verify",
    });
    console.log("Verify email sent to:", to);
  } catch (error: any) {
    console.error("Verify email failed", error.message);
  }
};
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

export const sendOrderEmail = async (to: string, order: any) => {
  try {
    // const transporter = createTransporter();

    // await transporter.sendMail({
    //   from: process.env.EMAIL_USER,
    //   to,
    //   subject: "Your FoodHub Order Confirmation",
    //   html: orderConfirmationTemplate(order),
    // });
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.EMAIL_USER as string,
      to,
      subject: "Your FoodHub Order Confirmation",
      html: orderConfirmationTemplate(order),
    });
    console.log("Order email sent to:", to);
  } catch (error: any) {
    console.error("Order email failed", error.message);
  }
};
