import nodemailer from "nodemailer";



export const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.HOST,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: text,
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return { message: "Email sent" };
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Email not sent");
  }
};
export default sendEmail;

