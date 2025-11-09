import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your app password
  },
});

export const sendLowStockAlert = async (
  adminEmail: string,
  productName: string,
  variantName: string,
  currentStock: number,
  threshold: number
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: `⚠️ Low Stock Alert: ${productName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Low Stock Alert</h2>
        <p>The following product variant is running low on stock:</p>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #991b1b;">${productName}</h3>
          <p style="margin: 5px 0;"><strong>Variant:</strong> ${variantName}</p>
          <p style="margin: 5px 0;"><strong>Current Stock:</strong> <span style="color: #dc2626; font-size: 18px; font-weight: bold;">${currentStock} units</span></p>
          <p style="margin: 5px 0;"><strong>Threshold:</strong> ${threshold} units</p>
        </div>
        
        <p style="margin-top: 20px;">Please restock this item as soon as possible.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">This is an automated alert from your EMI Store Inventory Management System.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Low stock alert sent to ${adminEmail} for ${productName} - ${variantName}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

export const sendTestEmail = async (email: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: '✅ Email Configuration Test',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Email Configuration Successful</h2>
        <p>Your email notification system is working correctly!</p>
        <p>You will receive alerts when product stock drops below the threshold.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Test email sent successfully' };
  } catch (error) {
    console.error('Error sending test email:', error);
    return { success: false, error };
  }
};
