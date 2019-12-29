module.exports = {
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  pool: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};
