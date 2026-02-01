import nodemailer from "nodemailer";

export const createTransporter = async () => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  });

  await transporter.verify();

  console.log("✅ SMTP Connected (Brevo)");

  return transporter;
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
