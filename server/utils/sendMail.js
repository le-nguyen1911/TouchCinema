import transporter from "../configs/mail.js";

export const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"TouchCinema " <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(" Email sent successfully!");
  } catch (err) {
    console.log(" Email send failed:", err.message);
  }
};
