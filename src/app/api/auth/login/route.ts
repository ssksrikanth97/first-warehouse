import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phone, password } = body;

        console.log('Login attempt for:', phone);

        if (!phone || !password) {
            return NextResponse.json({ error: 'Phone and password are required' }, { status: 400 });
        }

        // 1. Check Maintenance Mode
        let maintenanceMode = null;
        try {
            // @ts-ignore - Handle potential stale client
            if (prisma.systemSetting) {
                maintenanceMode = await prisma.systemSetting.findUnique({
                    where: { key: 'MAINTENANCE_MODE' }
                });
            }
        } catch (e) {
            console.warn('Maintenance check failed:', e);
        }

        const isMaintenanceOn = maintenanceMode?.value === 'true';

        // 2. Find User
        const user = await prisma.user.findUnique({
            where: { phone }
        });

        if (!user) {
            console.log('User not found');
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 3. Verify Password (Simple check for demo, use bcrypt in real app)
        if (user.password !== password) {
            console.log('Invalid password');
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 4. Enforce Maintenance Mode
        if (isMaintenanceOn && user.role !== 'SUPER_ADMIN') {
            console.log('Maintenance mode active, blocking user');
            let maintenanceMessage = null;
            try {
                // @ts-ignore
                if (prisma.systemSetting) {
                    maintenanceMessage = await prisma.systemSetting.findUnique({
                        where: { key: 'MAINTENANCE_MESSAGE' }
                    });
                }
            } catch (e) { }
            return NextResponse.json({
                error: 'System is under maintenance',
                maintenanceMode: true,
                message: maintenanceMessage?.value || 'We are currently upgrading the system. Please try again later.'
            }, { status: 503 });
        }

        if (!user.isActive && user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Account is inactive. Please contact support.' }, { status: 403 });
        }

        // 5. Successful Login
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            user: userWithoutPassword,
            token: 'mock-jwt-token-for-demo', // In real app, generate JWT
        });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
