import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, shopName, location, email } = body;

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name,
                shopName,
                location,
                email
            }
        });

        return NextResponse.json({
            id: updatedUser.id,
            name: updatedUser.name,
            shopName: updatedUser.shopName,
            location: updatedUser.location,
            email: updatedUser.email,
            role: updatedUser.role
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, currentPassword, newPassword } = body;

        if (!id || !currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // In a real app, use bcrypt.compare
        if (user.password !== currentPassword) {
            return NextResponse.json({ error: 'Incorrect current password' }, { status: 401 });
        }

        // In a real app, hash the new password
        await prisma.user.update({
            where: { id },
            data: { password: newPassword }
        });

        return NextResponse.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error("Error changing password:", error);
        return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
    }
}
