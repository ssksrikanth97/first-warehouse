"use client"

import { InventoryView } from '@/components/admin-views/InventoryView';
import { useAdmin } from '@/context/AdminContext';

export default function InventoryPage() {
    const { products, updateStock, addProduct, updateProduct, categories } = useAdmin();

    return (
        <InventoryView
            products={products}
            updateStock={updateStock}
            addProduct={addProduct}
            updateProduct={updateProduct}
            categories={categories}
        />
    );
}
