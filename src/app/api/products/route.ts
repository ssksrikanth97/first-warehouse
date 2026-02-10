import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                inventory: true,
            },
            orderBy: {
                updatedAt: 'desc',
            }
        });

        // Map to frontend interface
        const formattedProducts = products.map(p => ({
            ...p,
            stock: p.inventory.reduce((sum, item) => sum + item.quantity, 0),
        }));

        return NextResponse.json(formattedProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation could be expanded here
        if (!body.name || !body.sku || !body.categoryId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name: body.name,
                sku: body.sku,
                brand: body.brand,
                categoryId: body.categoryId,
                image: body.image,
                description: body.description,
                wholesalePrice: parseFloat(body.wholesalePrice),
                mrp: parseFloat(body.mrp),
                sellingUnit: body.sellingUnit,
                unitsPerPack: parseInt(body.unitsPerPack) || 1,
                unit: body.unit || 'piece',
                minOrderQuantity: parseInt(body.minOrderQuantity) || 1,
                // stock is handled via relation
                warehouseId: body.warehouseId || "WH-001",
                gstPercentage: parseFloat(body.gstPercentage) || 0,
                hsnCode: body.hsnCode,
                isActive: body.isActive ?? true,
            }
        });

        // Create initial inventory
        if (body.stock) {
            await prisma.inventory.create({
                data: {
                    productId: product.id,
                    warehouseId: body.warehouseId || "WH-001",
                    quantity: parseInt(body.stock),
                }
            });
        }

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
