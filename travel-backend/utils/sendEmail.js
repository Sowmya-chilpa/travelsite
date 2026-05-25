const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,        
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter error:", error); // ← This will show in Render logs
  } else {
    console.log("Email server is ready");
  }
});


module.exports = sendEmail;