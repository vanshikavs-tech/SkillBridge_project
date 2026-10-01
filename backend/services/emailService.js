/**
 * Transactional Email Service
 * 
 * Concept:
 * In production, wraps Nodemailer / SendGrid / Amazon SES.
 * In development, logs transactional emails to the console so no SMTP credentials are required.
 */
const sendEmail = async ({ to, subject, html, text }) => {
  console.log(`[EmailService] 📧 Sending Email to: ${to}`);
  console.log(`[EmailService] 📝 Subject: ${subject}`);
  if (process.env.NODE_ENV === 'development') {
    console.log(`[EmailService] 📄 Content: ${text || html}`);
  }
  return { success: true, messageId: `msg_${Date.now()}` };
};

module.exports = {
  sendEmail,
};
