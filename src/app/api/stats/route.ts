import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const [
            totalProducts,
            totalOrders,
            totalUsers,
            recentOrders,
            lowStockProducts
        ] = await Promise.all([
            prisma.product.count(),
            prisma.order.count(),
            prisma.user.count(),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: true }
            }),
            prisma.product.findMany({
                // This is tricky because stock is in Inventory relation.
                // We might need to fetch products and filter in memory if we can't do complex relation filtering easily
                // or ensure inventory is populated.
                // For now, let's just get count of products with inventory < 10 if we can.
                // Prisma relation filtering:
                where: {
                    inventory: {
                        some: {
                            quantity: {
                                lte: 10
                            }
                        }
                    }
                },
                take: 5
            })
        ]);

        // Calculate total revenue (simple sum of all orders for now, ideally filter by status)
        const revenueResult = await prisma.order.aggregate({
            _sum: {
                totalAmount: true
            }
        });
        const totalRevenue = revenueResult._sum.totalAmount || 0;

        return NextResponse.json({
            totalProducts,
            totalOrders,
            totalUsers,
            totalRevenue,
            recentOrders,
            lowStockProducts
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
