import nodemailer from "nodemailer";
import { EMAIL_SUBJECTS } from "../constants.js";

// Check for required environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn("⚠️ WARNING: EMAIL_USER or EMAIL_PASS is missing in environment variables!");
}

// Create reusable transporter with SSL and IPv4 force for Render
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    servername: 'smtp.gmail.com' // Explicitly set servername for SSL handshake
  },
  family: 4, // 🔥 Force IPv4 to fix 'ENETUNREACH' on Render
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Verify transporter connection on startup (non-blocking)
// Only log error if Resend is NOT being used, otherwise this is expected on Render
transporter.verify().then(() => {
  console.log("✅ Mailer: Gmail SMTP Pool is ready");
}).catch(err => {
  if (!process.env.RESEND_API) {
    console.error("❌ Mailer: Gmail Verification failed:", err.message);
  } else {
    console.log("ℹ️ Mailer: Gmail SMTP unavailable (Expected on Render). Using Resend API as primary.");
  }
});

const interviewTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.INTERVIEW_GMAIL_USER,
    pass: process.env.INTERVIEW_GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    servername: 'smtp.gmail.com'
  },
  family: 4,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

/**
 * BULLETPROOF Background Email Sending with Retries
 * Fixes ENETUNREACH and handles transient failures
 */
const sendWithRetry = async (transp, options, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const info = await transp.sendMail(options);
      console.log(`✅ Email sent [Attempt ${i + 1}]: ${info.messageId}`);
      return info;
    } catch (err) {
      console.error(`⚠️ Email Attempt ${i + 1} failed: ${err.message}`);
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delay * (i + 1))); // Exponential backoff
    }
  }
};

/**
 * PRODUCTION-GRADE Non-blocking Email function
 * Uses SendGrid API if SENDGRID_API is present, otherwise falls back to Gmail
 */
export const sendEmail = async ({ to, subject, html, useInterviewEmail = false }) => {
  // 🔥 Consolidating everything to use the Interview email account as requested
  const fromEmail = process.env.INTERVIEW_GMAIL_USER;

  // 💎 PRIMARY: SendGrid API (Best for Render, sends to ANYONE without domain)
  if (process.env.SENDGRID_API) {
    console.log(`🚀 Using SendGrid API for ${to} (From: ${fromEmail})`);

    fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SENDGRID_API}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: {
          email: fromEmail,
          name: "HRConnect Team"
        },
        subject: subject,
        content: [{
          type: "text/html",
          value: html
        }]
      })
    })
      .then(async (res) => {
        if (res.status === 202) {
          console.log("✅ SendGrid success!");
        } else {
          const errorData = await res.json();
          console.error("❌ SendGrid error details:", JSON.stringify(errorData, null, 2));
        }
      })
      .catch(e => console.error("❌ SendGrid fetch error:", e.message));

    return true; // Return to API instantly
  }

  const mailOptions = {
    from: `"HRConnect Team" <${fromEmail}>`,
    to,
    subject,
    html,
  };

  console.log(`📧 Queuing background email via Gmail to: ${to}`);

  const currentTransporter = useInterviewEmail ? interviewTransporter : transporter;

  // Non-blocking background task with retries
  sendWithRetry(currentTransporter, mailOptions)
    .catch(err => console.error(`🚨 FATAL: Gmail SMTP failed for ${to}:`, err.message));

  return true;
};

// ─────────────────────────────────────────────
// Email Templates
// ─────────────────────────────────────────────

const baseLayout = (content) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
    <div style="background: #1a73e8; padding: 20px; border-radius: 8px 8px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 22px;">ATS — Recruitment System</h1>
    </div>
    <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
      ${content}
    </div>
    <p style="text-align: center; color: #888; font-size: 12px; margin-top: 16px;">
      This is an automated message. Please do not reply to this email.
    </p>
  </div>
`;

export const sendOTP = async ({ to, otp }) => {
  const html = baseLayout(`
    <h2 style="color: #333;">Email verification code</h2>
    <p>Your one-time verification code is:</p>
    <div style="font-size: 32px; font-weight: 700; letter-spacing: 0.2em; margin: 24px 0; padding: 18px 24px; background: #eef4ff; color: #1a237e; border-radius: 14px; display: inline-block;">
      ${otp}
    </div>
    <p style="margin-top: 1rem; color: #555;">This code will expire in 15 minutes.</p>
    <p style="color: #555;">If you did not request this code, please ignore this email.</p>
    <br/>
    <p style="color: #555;">Thanks,<br/>ATS Team</p>
  `);

  await sendEmail({ to, subject: EMAIL_SUBJECTS.OTP_VERIFICATION, html });
};

/**
 * Notify candidate: application received
 */
export const sendApplicationReceivedEmail = async ({ to, name, jobTitle, branchName }) => {
  const html = baseLayout(`
    <h2 style="color: #333;">Hi ${name},</h2>
    <p>Thank you for applying to <strong>${jobTitle}</strong> at <strong>${branchName}</strong>.</p>
    <p>We have received your application and it is currently under review. We will notify you of any updates.</p>
    <br/>
    <p style="color: #555;">Best regards,<br/>HR Team</p>
  `);
  await sendEmail({ to, subject: EMAIL_SUBJECTS.APPLICATION_RECEIVED, html });
};

/**
 * Notify candidate: shortlisted
 */
export const sendShortlistedEmail = async ({ to, name, jobTitle }) => {
  const html = baseLayout(`
    <h2 style="color: #2e7d32;">Hi ${name}, Congratulations!</h2>
    <p>We are pleased to inform you that you have been <strong>shortlisted</strong> for the position of <strong>${jobTitle}</strong>.</p>
    <p>Our HR team will be in touch with further details soon. Please keep an eye on your inbox.</p>
    <br/>
    <p style="color: #555;">Best regards,<br/>HR Team</p>
  `);
  await sendEmail({ to, subject: EMAIL_SUBJECTS.SHORTLISTED, html });
};

/**
 * Notify candidate: rejected
 */
export const sendRejectedEmail = async ({ to, name, jobTitle }) => {
  const html = baseLayout(`
    <h2 style="color: #333;">Hi ${name},</h2>
    <p>Thank you for your interest in the position of <strong>${jobTitle}</strong>.</p>
    <p>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.</p>
    <p>We encourage you to apply for future openings that match your skills and experience.</p>
    <br/>
    <p style="color: #555;">Best regards,<br/>HR Team</p>
  `);
  await sendEmail({ to, subject: EMAIL_SUBJECTS.REJECTED, html });
};

/**
 * Notify candidate: accepted (offer)
 */
export const sendAcceptedEmail = async ({ to, name, jobTitle, branchName }) => {
  const html = baseLayout(`
    <h2 style="color: #1a73e8;">Hi ${name}, Welcome Aboard! 🎉</h2>
    <p>We are thrilled to inform you that your application for <strong>${jobTitle}</strong> at <strong>${branchName}</strong> has been <strong>accepted</strong>.</p>
    <p>Our HR team will contact you shortly with onboarding details. Congratulations!</p>
    <br/>
    <p style="color: #555;">Best regards,<br/>HR Team</p>
  `);
  await sendEmail({ to, subject: EMAIL_SUBJECTS.ACCEPTED, html });
};

/**
 * Notify candidate: interview scheduled
 */
export const sendInterviewScheduledEmail = async ({ to, name, jobTitle, date, time, message, type, meetingLink }) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = baseLayout(`
    <h2 style="color: #333;">Hi ${name},</h2>
    <p>Your interview for <strong>${jobTitle}</strong> has been scheduled.</p>
    <div style="background: #f0f4ff; border-left: 4px solid #1a73e8; padding: 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0;"><strong>📅 Date:</strong> ${formattedDate}</p>
      ${time ? `<p style="margin: 8px 0 0;"><strong>⏰ Time:</strong> ${time}</p>` : ""}
      <p style="margin: 8px 0 0;"><strong>💻 Type:</strong> ${type}</p>
      ${meetingLink ? `<p style="margin: 8px 0 0;"><strong>🔗 Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ""}
    </div>
    ${message ? `<p><strong>Additional Message:</strong><br/>${message}</p>` : ""}
    <p>Please make sure to be available at the scheduled time. If you have any questions, contact your HR representative.</p>
    <br/>
    <p style="color: #555;">Best regards,<br/>HR Team</p>
  `);
  await sendEmail({ to, subject: EMAIL_SUBJECTS.INTERVIEW_SCHEDULED, html, useInterviewEmail: true });
};
