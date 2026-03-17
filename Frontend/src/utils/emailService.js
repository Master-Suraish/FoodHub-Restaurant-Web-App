import emailjs from "@emailjs/browser";

export const sendVerificationEmail = async (userEmail, verifyUrl) => {
  try {
    const templateParams = {
      email: userEmail,
      verifyUrl: verifyUrl,
    };

    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    );
    return result;
  } catch (error) {
    console.error("EmailJS Error:", error);
    throw error;
  }
};
