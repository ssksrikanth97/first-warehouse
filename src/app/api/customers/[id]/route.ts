import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                isActive: body.isActive,
                creditLimit: body.creditLimit ? parseFloat(body.creditLimit) : undefined,
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating retailer:", error);
        return NextResponse.json({ error: 'Failed to update retailer' }, { status: 500 });
    }
}
