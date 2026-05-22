import nodemailer from "nodemailer";
import axios from "axios";


const PAYLOAD_URL = process.env.PAYLOAD_URL || "http://localhost:4000";
const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET;

// Template para email al admin
const getAdminEmailTemplate = ({
  name,
  email,
  about,
  message,
  submissionId,
  date,
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Submission - PeptideScore</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #2C3245; padding: 40px 32px; text-align: center; }
        .logo { color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: -0.5px; }
        .subtitle { color: #F5F5F5; font-size: 16px; margin-top: 8px; }
        .content { padding: 40px 32px; }
        .alert-badge { background-color: #2196F3; color: white; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 600; display: inline-block; margin-bottom: 24px; }
        .submission-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .field-group { margin-bottom: 20px; }
        .field-label { font-weight: 600; color: #2C3245; font-size: 14px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
        .field-value { color: #4a5568; font-size: 16px; line-height: 1.5; }
        .message-content { background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-top: 8px; }
        .meta-info { background-color: #e2e8f0; border-radius: 8px; padding: 16px; margin-top: 24px; font-size: 14px; color: #64748b; }
        .footer { background-color: #2C3245; padding: 32px; text-align: center; color: #F5F5F5; font-size: 14px; }
        .footer a { color: #2196F3; text-decoration: none; }
        .priority-high { color: #dc2626; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">PEPTIDESCORE</div>
            <div class="subtitle">One platform. All features. Peptide you can test</div>
        </div>
        
        <div class="content">
            <div class="alert-badge">NEW CONTACT SUBMISSION</div>
            
            <h2 style="color: #2C3245; font-size: 24px; font-weight: 700; margin-bottom: 16px;">
                New Contact Form Submission
            </h2>
            
            <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                You have received a new contact form submission from your PeptideScore website. 
                Please review the details below and respond promptly.
            </p>
            
            <div class="submission-card">
                <div class="field-group">
                    <div class="field-label">Contact Name</div>
                    <div class="field-value">${name}</div>
                </div>
                
                <div class="field-group">
                    <div class="field-label">📧 Email Address</div>
                    <div class="field-value">
                        <a href="mailto:${email}" style="color: #2196F3; text-decoration: none;">
                            ${email}
                        </a>
                    </div>
                </div>
                
                <div class="field-group">
                    <div class="field-label">🧬 Interest Area</div>
                    <div class="field-value">${about || "Not specified"}</div>
                </div>
                
                <div class="field-group">
                    <div class="field-label">Message</div>
                    <div class="message-content">
                        ${message.replace(/\n/g, "<br>")}
                    </div>
                </div>
            </div>
            
            <div class="meta-info">
                <strong>Submission Details:</strong><br>
                 Date: ${date}<br>
                 ID: ${submissionId || "N/A"}<br>
                 Source: peptidescore.com/contact
            </div>
        </div>
        
        <div class="footer">
            <p><strong>PeptideScore Admin Panel</strong></p>
            <p>Ensuring a safer and more transparent peptide supply chain</p>
            <p style="margin-top: 16px;">
                <a href="https://peptidescore.com">Visit Website</a> | 
                <a href="mailto:${email}">Reply to Contact</a>
            </p>
        </div>
    </div>
</body>
</html>`;
};

const getUserConfirmationTemplate = ({ name }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for contacting PeptideScore</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #2C3245; padding: 40px 32px; text-align: center; }
        .logo { color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: -0.5px; }
        .subtitle { color: #F5F5F5; font-size: 16px; margin-top: 8px; }
        .content { padding: 40px 32px; }
        .success-badge { background-color: #10b981; color: white; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 600; display: inline-block; margin-bottom: 24px; }
        .message-card { background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
        .cta-button { background-color: #2196F3; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600; margin: 16px 0; }
        .cta-button:hover { background-color: #1976D2; }
        .info-section { background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0; }
        .footer { background-color: #2C3245; padding: 32px; text-align: center; color: #F5F5F5; font-size: 14px; }
        .footer a { color: #2196F3; text-decoration: none; }
        .social-icons { margin-top: 20px; }
        .social-icons a { display: inline-block; margin: 0 8px; width: 40px; height: 40px; background-color: #ffffff; border-radius: 50%; text-align: center; line-height: 40px; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">PEPTIDESCORE</div>
            <div class="subtitle">One platform. All features. Peptide you can test</div>
        </div>
        
        <div class="content">
            <div class="success-badge">✅ MESSAGE RECEIVED</div>
            
            <h2 style="color: #2C3245; font-size: 28px; font-weight: 700; margin-bottom: 16px;">
                Thank you for reaching out, ${name}!
            </h2>
            
            <p style="color: #64748b; font-size: 18px; line-height: 1.6; margin-bottom: 24px;">
                We've received your message and appreciate your interest in our peptide testing services.
            </p>
            
            <div class="message-card">
                <h3 style="color: #0ea5e9; font-size: 20px; font-weight: 600; margin-bottom: 12px;">
                    🧬 What happens next?
                </h3>
                <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                    Our team will review your message and get back to you within <strong>24-48 hours</strong>. 
                    We're here to help you with all your peptide testing needs.
                </p>
            </div>
            
            <div class="info-section">
                <h3 style="color: #2C3245; font-size: 18px; font-weight: 600; margin-bottom: 16px;">
                    🚀 While you wait, explore our services:
                </h3>
                <ul style="color: #64748b; font-size: 16px; line-height: 1.8; margin-left: 20px;">
                    <li><strong>Free Sample Testing:</strong> Send us a vial for complimentary analysis</li>
                    <li><strong>Certificate of Analysis:</strong> Get detailed test results from commercial labs</li>
                    <li><strong>Vendor Verification:</strong> Help ensure safer peptide sourcing</li>
                </ul>
                
                <a href="https://peptidescore.com" class="cta-button">
                    Explore PeptideScore
                </a>
            </div>
            
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <h4 style="color: #92400e; font-size: 16px; font-weight: 600; margin-bottom: 8px;">
                    📋 Need immediate assistance?
                </h4>
                <p style="color: #92400e; font-size: 14px; line-height: 1.5;">
                    For urgent inquiries, you can also reach us through our 
                    <a href="https://www.reddit.com/r/saferpeptides/" style="color: #2196F3;">Reddit community</a> 
                    where we actively participate in peptide safety discussions.
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>PeptideScore Team</strong></p>
            <p>Ensuring a safer and more transparent peptide supply chain</p>
            
            <div class="social-icons">
                <a href="https://peptidescore.com" style="color: #2196F3;">🌐</a>
                <a href="https://www.reddit.com/r/saferpeptides/" style="color: #2196F3;">📱</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                © 2025 PeptideScore. All rights reserved.<br>
                One platform. All features. Peptide you can test.
            </p>
        </div>
    </div>
</body>
</html>`;
};
export const createSubmission = async (req, res) => {
//const createSubmission = async (req, res) => {
  try {
    const { name, email, about, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, email, and message are required" });
    }

    // 
    const saved = await axios.post(
      `${PAYLOAD_URL}/api/contact`,
      { name, email, about, message },
      {
        headers: {
          Authorization: `users API-Key ${PAYLOAD_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    const transporter = nodemailer.createTransport({
      host: "mail.smtp2go.com",
      port: 2525,
      secure: false,
      auth: {
        user: "peptidescore.com",
        pass: "alpha731!",
      },
    });

    //TODO: Template, should be better if we separate this in components
    const templateData = {
      name,
      email,
      about,
      message,
      submissionId: saved.data?.doc?.id,
      date: new Date().toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      }),
    };

    await transporter.sendMail({
      from: '"PeptideScore Contact System" <no-reply@peptidescore.com>',
      to: "admin@peptidescore.com",//BETTER IF WE SAVE THIS in .env
      subject: `New Contact Submission from ${name}`,
      html: getAdminEmailTemplate(templateData),
    });

    await transporter.sendMail({
      from: '"PeptideScore Team" <admin@peptidescore.com>',
      to: email,
      subject: "✅ We received your message - PeptideScore",
      html: getUserConfirmationTemplate({ name }),
    });

    res.status(200).json({
      success: true,
      successful: true,
      message: "Contact submission saved and emails sent",
      data: saved.data.doc,
    });
  } catch (error) {
    console.error("Error creating submission:", error?.response?.data || error);
    res.status(500).json({
      error: "Failed to create contact submission",
      success: false,
      successful: false,
    });
  }
};

//module.exports = { createSubmission };
