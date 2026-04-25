const nodemailer = require('nodemailer');

const hasSmtpConfig = !!(process.env.SMTP_USER && process.env.SMTP_PASS);

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
        user: process.env.SMTP_USER || 'dummy',
        pass: process.env.SMTP_PASS || 'dummy'
    }
});

const sendEmail = async (to, subject, htmlContent) => {
    if (hasSmtpConfig) {
        try {
            await transporter.sendMail({
                from: `"FSSAI Platform" <${process.env.SMTP_USER}>`,
                to,
                subject,
                html: htmlContent
            });
            console.log(`✅ Email sent successfully to ${to}`);
        } catch (err) {
            console.error(`❌ Failed to send email to ${to}:`, err.message);
        }
    } else {
        // ── FALLBACK FOR DEVELOPMENT / IF SMTP ISNT CONFIGURED ──
        console.log(`\n================= 📧 MOCK EMAIL =================`);
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Content:\n${htmlContent.replace(/<[^>]+>/g, '')}`); // stripping HTML for console view
        console.log(`===================================================\n`);
    }
};

module.exports = {

    sendPasswordResetEmail: async (email, resetLink) => {
        const html = `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:20px;border:1px solid #eee;border-radius:10px;">
        <h2 style="color:#1d4ed8;">Password Reset Request</h2>
        <p>You requested a password reset for your FSSAI account.</p>
        <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#1d4ed8;color:white;text-decoration:none;border-radius:6px;margin:20px 0;">Reset Password</a>
        <p style="color:#6b7280;font-size:12px;">This link will expire in 15 minutes. Ignore if you didn't request this.</p>
      </div>
    `;
        await sendEmail(email, '🔐 Reset Your Password', html);
    },

    sendComplaintResolvedEmail: async (email, restaurantName, resolution) => {
        const html = `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:20px;border:1px solid #10b981;border-radius:10px;">
        <h2 style="color:#047857;">Complaint Resolved</h2>
        <p>Your hygiene complaint against <strong>${restaurantName}</strong> has been investigated and resolved by an FSSAI Inspector.</p>
        <div style="background:#f9fafb;padding:15px;border-left:4px solid #10b981;margin-top:15px;">
          <p style="margin:0;color:#374151;"><strong>Inspector's Note:</strong></p>
          <p style="margin-top:5px;font-style:italic;">"${resolution}"</p>
        </div>
        <br>
        <p style="color:#6b7280;font-size:13px;">Thank you for helping us maintain public food safety standards.</p>
      </div>
    `;
        await sendEmail(email, `✔️ Complaint Resolved: ${restaurantName}`, html);
    },

    sendInspectionScheduledEmail: async (email, inspectorName, restaurantName, date) => {
        const html = `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:20px;border:1px solid #f59e0b;border-radius:10px;">
        <h2 style="color:#b45309;">New Inspection Assignment</h2>
        <p>Hello <strong>${inspectorName}</strong>,</p>
        <p>You have been assigned a new inspection mandate by the FSSAI Regional Admin.</p>
        <table style="width:100%;margin-top:15px;border-collapse:collapse;">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Restaurant</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${restaurantName}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Scheduled Target</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${date}</td></tr>
        </table>
        <br>
        <p style="color:#6b7280;font-size:13px;">Please log into the Inspector Portal for detailed routing and evaluation criteria.</p>
      </div>
    `;
        await sendEmail(email, `📅 Audit Scheduled: ${restaurantName}`, html);
    }

};
