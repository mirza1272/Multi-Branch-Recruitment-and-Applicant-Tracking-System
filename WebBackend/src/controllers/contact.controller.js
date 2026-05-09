import { sendEmail } from "../utils/mailer.js";

export const handleContactForm = async (req, res) => {
    try {
        const { firstName, lastName, email, message } = req.body;

        if (!firstName || !email || !message) {
            return res.status(400).json({ success: false, message: "Please fill in all required fields." });
        }

        const adminEmail = "mirzahaseeb0566@gmail.com";
        const subject = `New Contact Form Submission from ${firstName} ${lastName}`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Contact Form Details</h2>
                <div style="margin-top: 20px;">
                    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; font-style: italic;">
                        ${message}
                    </div>
                </div>
                <p style="margin-top: 30px; font-size: 0.85rem; color: #6b7280; text-align: center;">
                    This message was sent via HRConnect Contact Form.
                </p>
            </div>
        `;

        // Send email to admin
        await sendEmail({ to: adminEmail, subject, html });

        return res.status(200).json({ success: true, message: "Message sent successfully! We will get back to you soon." });
    } catch (error) {
        console.error("Error in contact controller:", error);
        return res.status(500).json({ success: false, message: "Internal server error. Please try again later." });
    }
};

export const handleSubscription = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Please provide an email address." });
        }

        const adminEmail = "mirzahaseeb0566@gmail.com";
        const subject = `New Newsletter Subscription: ${email}`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Subscription</h2>
                <div style="margin-top: 20px;">
                    <p>A new user has subscribed to the HRConnect newsletter.</p>
                    <p><strong>Subscriber Email:</strong> <a href="mailto:${email}">${email}</a></p>
                </div>
                <p style="margin-top: 30px; font-size: 0.85rem; color: #6b7280; text-align: center;">
                    This subscription was made via HRConnect Footer.
                </p>
            </div>
        `;

        await sendEmail({ to: adminEmail, subject, html });

        return res.status(200).json({ success: true, message: "Thank you for subscribing!" });
    } catch (error) {
        console.error("Error in subscription controller:", error);
        return res.status(500).json({ success: false, message: "Internal server error. Please try again later." });
    }
};
