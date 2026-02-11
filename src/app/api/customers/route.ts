import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET: List all retailers
export async function GET() {
    try {
        const retailers = await prisma.user.findMany({
            where: { role: 'RETAILER' },
            orderBy: { createdAt: 'desc' },
            include: {
                orders: {
                    select: {
                        totalAmount: true
                    }
                },
                _count: {
                    select: { orders: true }
                }
            }
        });

        const formattedRetailers = retailers.map(user => ({
            id: user.id,
            name: user.name,
            shopName: user.shopName,
            phone: user.phone,
            location: user.location,
            outstandingBalance: user.outstandingBalance,
            isActive: user.isActive,
            createdAt: user.createdAt,
            ordersCount: user._count.orders,
            totalSpend: user.orders.reduce((sum, order) => sum + order.totalAmount, 0)
        }));

        return NextResponse.json(formattedRetailers);
    } catch (error) {
        console.error("Error fetching retailers:", error);
        return NextResponse.json({ error: 'Failed to fetch retailers' }, { status: 500 });
    }
}

// POST: Create new retailer
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.phone || !body.name || !body.shopName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { phone: body.phone }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User with this phone already exists' }, { status: 409 });
        }

        const newRetailer = await prisma.user.create({
            data: {
                phone: body.phone,
                name: body.name,
                shopName: body.shopName,
                location: body.location,
                role: 'RETAILER',
                // Default password for now, could be improved with auth flow
                password: 'password123',
                isActive: true
            }
        });

        return NextResponse.json(newRetailer, { status: 201 });
    } catch (error) {
        console.error("Error creating retailer:", error);
        return NextResponse.json({ error: 'Failed to create retailer' }, { status: 500 });
    }
}
