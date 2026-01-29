import nodemailer from "nodemailer";

export const createTransporter = async () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
};


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
