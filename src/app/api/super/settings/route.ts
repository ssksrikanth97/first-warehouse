import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const settings = await prisma.systemSetting.findMany();
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { key, value, description } = body;

        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 });
        }

        const setting = await prisma.systemSetting.upsert({
            where: { key },
            update: { value, description },
            create: { key, value, description }
        });

        return NextResponse.json(setting);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
    }
}
