import fetch from "node-fetch";

const sendEmail = async ({ name, email, message }) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: {
  name: "Portfolio Contact",
  email: "yourgmail@gmail.com"
},
        to: [
          {
            email: "yourgmail@gmail.com"
          }
        ],
        subject: "📩 New Portfolio Contact Message",
        htmlContent: `
          <h3>New Contact Message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p>${message}</p>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Brevo API error:", data);
    } else {
      console.log("📧 Email sent via Brevo API");
    }
  } catch (error) {
    console.error("❌ Email API failed:", error.message);
  }
};

export default sendEmail;
