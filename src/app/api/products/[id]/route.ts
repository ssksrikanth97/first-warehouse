import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                inventory: true,
            },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const formattedProduct = {
            ...product,
            stock: product.inventory.reduce((sum, item) => sum + item.quantity, 0),
        };

        return NextResponse.json(formattedProduct);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Update product fields
        const product = await prisma.product.update({
            where: { id },
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
                unitsPerPack: parseInt(body.unitsPerPack),
                unit: body.unit,
                minOrderQuantity: parseInt(body.minOrderQuantity),
                warehouseId: body.warehouseId,
                gstPercentage: parseFloat(body.gstPercentage),
                hsnCode: body.hsnCode,
                isActive: body.isActive,
            },
        });

        // Handle inventory update if stock is provided
        if (body.stock !== undefined) {
            // For simplicity, we assume one warehouse for now or update the main one
            // We first check if an inventory record exists
            const inventory = await prisma.inventory.findFirst({
                where: { productId: id, warehouseId: body.warehouseId || "WH-001" }
            });

            if (inventory) {
                await prisma.inventory.update({
                    where: { id: inventory.id },
                    data: { quantity: parseInt(body.stock) }
                });
            } else {
                await prisma.inventory.create({
                    data: {
                        productId: id,
                        warehouseId: body.warehouseId || "WH-001",
                        quantity: parseInt(body.stock)
                    }
                });
            }
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Check for related records before delete?
        // Prisma might handle cascade if configured, currently it implies cascade for relations defined?
        // Let's delete manually to be safe or rely on relation onDelete.
        // In schema, we didn't specify onDelete: Cascade. 
        // So we should delete inventory first.

        await prisma.inventory.deleteMany({
            where: { productId: id }
        });

        await prisma.product.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
