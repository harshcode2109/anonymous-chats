import transporter from "../config/nodemailer.js";
export const sendMail = async (email, type, token) => {
  console.log("otp",token);
  let subject, htmlContent, text;
  switch (type) {
    case "otp":
      (subject = "Register  using this OTP"), (text = `Your OTP is ${token}`);

      break;

    case "resetPassword":
      (subject = `Password Reset Instruction for College-anonymous account`),
        (htmlContent = `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #FF5733;">Reset Your Password</h2>
          <p style="font-size: 16px; color: #333;">Click the button below to reset your password:</p>
          <a href="${token}" style="display: inline-block; background-color: #FF5733; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
          <p style="font-size: 14px; color: #666;">If you didn’t request a password reset, you can safely ignore this email.</p>
        </div>
      </div>
    `);
      break;

    default:
      break;
  }
  const mailOptions = {
    from: "Anonymous",
    to: email,
    subject: subject,
    html: htmlContent,
    text
  };

  try {
    await transporter.sendMail(mailOptions);

    return { success: true, message: "Mail sent successfully" };
  } catch (error) {
    return { success: false, message: "Failed to send Mail" };
  }
};
