import nodemailer from 'nodemailer';

export const resetExporter = async (email: string, token: string) => {
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
        subject: 'Reset Your Account Password at MFAuth',
        html: `
            <div style='font-family: Arial, sans-serif; background: linear-gradient(to bottom, #1B1B1B, #2B2B2B); padding: 30px;'>
                <div style='max-width: 500px; margin: auto; background: #3B3B3B; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);'>
                    <h2 style='color: #fff;'>MFAuth - Password Reset</h2>
                    <p style='font-size: 14px; color: #ddd;'>Hey,</p>
                    <p style='font-size: 14px; color: #ddd;'>We received a request to reset your password.</p>
                    <p style='font-size: 14px; color: #ddd;'>Let's get you a new one. To proceed, please click the link below:</p>

                    <div style='text-align: center; margin: 20px 0;'>
                        <a href='${process.env.DOMAIN}/reset-password?token=${encodeURIComponent(token)}' 
                        style='display: inline-block; padding: 12px 24px; background-color: #5b5b5b; color: #fff; font-weight: bold; border-radius: 6px; text-decoration: none;'>
                            Forgot Password?
                        </a>
                    </div>

                    <p style='font-size: 14px; color: #bbb;'>This link is valid for the next <strong>15 minutes only</strong>. Didn't request a password reset? please ignore this message.</p>
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