import SibApiV3Sdk from "sib-api-v3-sdk";

export const sendMail = async ({ to, subject, html }) => {
  try {
    const client = SibApiV3Sdk.ApiClient.instance;

    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    if (!process.env.BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY missing");
    }

    if (!process.env.BREVO_SENDER) {
      throw new Error("BREVO_SENDER missing");
    }

    const api = new SibApiV3Sdk.TransactionalEmailsApi();

    const result = await api.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER,
        name: "Filezent",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    console.log("✅ Email sent to:", to);

    return result;

  } catch (err) {
    console.error(
      "❌ Brevo Mail Error:",
      err.response?.body || err.message
    );
    throw err;
  }
};

//gmail smtp
// import nodemailer from "nodemailer";

// export const createTransporter = async () => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // TLS
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.EMAIL_APP_PASSWORD,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//     connectionTimeout: 10000,
//     greetingTimeout: 10000,
//     socketTimeout: 10000,
//   });

//   // Verify connection
//   await transporter.verify();

//   return transporter;
// };





// import nodemailer from "nodemailer";

// console.log("===== NODEMAILER ENV DEBUG =====");
// console.log("EMAIL:", process.env.EMAIL);
// console.log("EMAIL_APP_PASSWORD:", process.env.EMAIL_APP_PASSWORD);
// console.log("================================");

// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_APP_PASSWORD,
//   },
// });

// import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_APP_PASSWORD,
//   },
// });
