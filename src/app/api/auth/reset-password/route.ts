import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { contact } = await request.json(); // Can be email or phone

        if (!contact) {
            return NextResponse.json({ error: 'Email or Phone is required' }, { status: 400 });
        }

        // Find user by email or phone
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: contact },
                    { phone: contact }
                ]
            }
        });

        if (!user) {
            // Return success even if user not found to prevent enumeration
            return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

        // Save token to user
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry
            }
        });

        // Mock Email Sending
        // In a real app, use Resend, SendGrid, etc.
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        console.log("==================================================");
        console.log(`Password Reset Link for ${user.name} (${contact}):`);
        console.log(resetLink);
        console.log("==================================================");

        return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });

    } catch (error) {
        console.error("Error requesting password reset:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
