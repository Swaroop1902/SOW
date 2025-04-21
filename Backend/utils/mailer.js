const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: "swaroop.bidkar@harbingergroup.com", // your Outlook email
    pass:"Admin@123456", // your Outlook password or app password
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

module.exports = transporter;