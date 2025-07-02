import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, otp } = body;

        const user = await db.user.findUnique({
            where: { email },
        });
        if (!user || !user.otp || !user.otpExpiry) {
            return NextResponse.json({ message: "Unauthorized user" }, { status: 404 });
        }

        const validOtp = await bcrypt.compare(otp, user.otp);
        const validExpiry = user.otpExpiry > new Date();

        if (!validOtp) {
            return NextResponse.json({ message: "Invalid otp, please try again" }, { status: 401 });
        } else if(!validExpiry) {
            return NextResponse.json({ message: "OTP is expired" }, { status: 401 });
        } else if(user.isVerified) {
            return NextResponse.json({ message: "User is already verified" }, { status: 400 });
        }

        await db.user.update({
            where: { email },
            data: {
                isVerified: true,
                otp: null,
                otpExpiry: null,
            },
        });

        return NextResponse.json({ message: "OTP Verification is successful" }, { status: 200 });

    } catch (error){
        console.error('Error verifying otp:', error);
        return NextResponse.json({ message: 'Verification failed' }, { status: 500 });
    }
}