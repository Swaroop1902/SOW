const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: "", // your Outlook email
    pass:"", // your Outlook password or app password
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

module.exports = transporter;