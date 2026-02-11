import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                phone: true,
                role: true,
                shopName: true,
                isActive: true,
                createdAt: true
            }
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, action, payload } = body;
        // action: 'TOGGLE_STATUS' | 'RESET_PASSWORD' | 'CHANGE_ROLE'

        if (!id || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        let updatedUser;

        if (action === 'TOGGLE_STATUS') {
            const user = await prisma.user.findUnique({ where: { id } });
            if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

            updatedUser = await prisma.user.update({
                where: { id },
                data: { isActive: !user.isActive }
            });
        }
        else if (action === 'RESET_PASSWORD') {
            updatedUser = await prisma.user.update({
                where: { id },
                data: { password: payload.newPassword } // in real app, hash this
            });
        }
        else if (action === 'CHANGE_ROLE') {
            updatedUser = await prisma.user.update({
                where: { id },
                data: { role: payload.role }
            });
        }

        return NextResponse.json({ success: true, user: updatedUser });

    } catch (error) {
        console.error("Error managing user:", error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
