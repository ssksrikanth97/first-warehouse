import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const entityType = searchParams.get('entityType');

        const where = entityType ? { entityType } : {};

        const fields = await prisma.customFieldDefinition.findMany({
            where,
            orderBy: { createdAt: 'asc' }
        });
        return NextResponse.json(fields);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch fields' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { entityType, name, key, type, options, required, visible } = body;

        if (!entityType || !name || !key || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate Key format (alphanumeric, no spaces)
        if (!/^[a-zA-Z0-9_]+$/.test(key)) {
            return NextResponse.json({ error: 'Key must be alphanumeric with underscores' }, { status: 400 });
        }

        const field = await prisma.customFieldDefinition.create({
            data: {
                entityType,
                name,
                key,
                type,
                options,
                required: required || false,
                visible: visible !== false
            }
        });

        return NextResponse.json(field);
    } catch (error) {
        console.error("Error creating field:", error);
        // Check for unique constraint violation
        if ((error as any).code === 'P2002') {
            return NextResponse.json({ error: 'Field key already exists for this entity' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create field' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.customFieldDefinition.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete field' }, { status: 500 });
    }
}
