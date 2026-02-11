import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { token, newPassword } = await request.json();

        if (!token || !newPassword) {
            return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
        }

        // Find user with valid token
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date() // Expiry must be in the future
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        // Update password and clear token
        // In a real app, hash the password!
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: newPassword, // Ideally hashed
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        return NextResponse.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error("Error setting new password:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
