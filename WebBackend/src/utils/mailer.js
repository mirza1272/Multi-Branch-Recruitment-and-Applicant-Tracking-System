import nodemailer from "nodemailer";
import { EMAIL_SUBJECTS } from "../constants.js";

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (not your regular password)
  },
});

/**
 * Core send function
 */
const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"ATS System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
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
export const sendInterviewScheduledEmail = async ({ to, name, jobTitle, date, time, message }) => {
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
    </div>
    ${message ? `<p><strong>Additional Message:</strong><br/>${message}</p>` : ""}
    <p>Please make sure to be available at the scheduled time. If you have any questions, contact your HR representative.</p>
    <br/>
    <p style="color: #555;">Best regards,<br/>HR Team</p>
  `);
  await sendEmail({ to, subject: EMAIL_SUBJECTS.INTERVIEW_SCHEDULED, html });
};
