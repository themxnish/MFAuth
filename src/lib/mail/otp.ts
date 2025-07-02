import nodemailer from 'nodemailer';

export const emailExporter = async (email: string, otp: string) => {
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    });

    const mail = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'OTP for Account Verification at MFAuth',
        html: `
            <div style='font-family: Arial, sans-serif; background: linear-gradient(to bottom, #1B1B1B, #2B2B2B); padding: 30px;'>
                <div style='max-width: 500px; margin: auto; background: #3B3B3B; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);'>
                    <h2 style='color: #fff;'>MFAuth - OTP Verification</h2>
                    <p style='font-size: 14px; color: #ddd;'>Hello,</p>
                    <p style='font-size: 14px; color: #ddd;'>Thank you for using MFAuth!</p>
                    <p style='font-size: 14px; color: #ddd;'>Your One Time Password (OTP) is:</p>
                    <p style='font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #fff; text-align: center; margin: 20px 0;'>${otp}</p>
                    <p style='font-size: 14px; color: #bbb;'>This OTP is valid for the next <strong>3 minutes only</strong>. Do not share it with anyone.</p>
                    <p style='font-size: 14px; color: #888;'>If you didn’t request this, please ignore this email.</p>
                    <hr style='margin: 20px 0; border: 0; border-top: 1px solid #555;' />
                    <p style='font-size: 12px; color: #666;'>MFAuth Security System</p>
                </div>
            </div>
            `,
    };

    try {
        await transporter.sendMail(mail);
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
}