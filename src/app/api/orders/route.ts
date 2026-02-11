import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        name: true,
                        shopName: true,
                        phone: true,
                        location: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                sku: true,
                                unit: true,
                                sellingUnit: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
