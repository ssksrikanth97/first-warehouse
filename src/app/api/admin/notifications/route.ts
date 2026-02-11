import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        // Fetch recent 5 users (last 24 hours or just recent)
        const recentUsers = await prisma.user.findMany({
            where: {
                role: 'RETAILER', // Assuming we only care about new retailers
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
                }
            },
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, shopName: true, createdAt: true }
        });

        // Fetch recent 5 orders
        const recentOrders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
                }
            },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } }
        });

        const notifications = [
            ...recentUsers.map(u => ({
                id: `user-${u.id}`,
                type: 'USER_ONBOARDED' as const,
                message: `New Retailer onboarded: ${u.name} (${u.shopName || 'No Shop Name'})`,
                timestamp: u.createdAt.toISOString(),
                read: false, // In a real app, track read state in DB
            })),
            ...recentOrders.map(o => ({
                id: `order-${o.id}`,
                type: 'ORDER_GENERATED' as const,
                message: `New Order #${o.id.slice(-6).toUpperCase()} from ${o.user.name}`,
                timestamp: o.createdAt.toISOString(),
                read: false,
            }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        // DUMMY NOTIFICATIONS FOR DEMO
        if (notifications.length < 5) {
            notifications.push({
                id: 'dummy-1',
                type: 'ORDER_GENERATED',
                message: 'New Order #ORD-DEMO1 from Ramesh Kumar',
                timestamp: new Date().toISOString(),
                read: false
            });
            notifications.push({
                id: 'dummy-2',
                type: 'USER_ONBOARDED',
                message: 'New Retailer onboarded: Suresh Kirana (Bangalore)',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                read: false
            });
            notifications.push({
                id: 'dummy-3',
                type: 'ORDER_GENERATED',
                message: 'New Order #ORD-DEMO2 from Demo Retailer',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                read: false
            });
        }

        return NextResponse.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}
