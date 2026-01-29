import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email server error:", error);
  } else {
    console.log("✅ Brevo SMTP ready");
  }
});

const sendEmail = async ({ name, email, message }) => {
  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <no-reply@yourdomain.com>`,
      to: process.env.SMTP_USER,
      subject: "📩 New Portfolio Contact Message",
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>${message}</p>
      `
    });

    console.log("📧 Email sent successfully");
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
  }
};

export default sendEmail;
