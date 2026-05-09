import nodemailer from "nodemailer";
import { EMAIL_SUBJECTS } from "../constants.js";

// Check for required environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn("⚠️ WARNING: EMAIL_USER or EMAIL_PASS is missing in environment variables!");
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Transporter Verification Failed:", error.message);
  } else {
    console.log("✅ Mailer is ready to take our messages");
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
    rejectUnauthorized: false
  }
});

/**
 * Core send function
 */
const sendEmail = async ({ to, subject, html, useInterviewEmail = false }) => {
  try {
    const fromEmail = useInterviewEmail ? process.env.INTERVIEW_GMAIL_USER : process.env.EMAIL_USER;
    const mailOptions = {
      from: `"HRConnect Team" <${fromEmail}>`,
      to,
      subject,
      html,
    };

    console.log(`📧 Attempting to send email to: ${to} (Subject: ${subject})`);
    const currentTransporter = useInterviewEmail ? interviewTransporter : transporter;
    const info = await currentTransporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Email Send Error [to: ${to}]:`, error.message);
    throw error;
  }
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
