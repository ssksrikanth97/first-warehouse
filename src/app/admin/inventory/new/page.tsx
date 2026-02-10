'use client';

import { useAdmin } from '@/context/AdminContext';
import { ProductForm } from '@/components/admin-views/ProductForm';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/db-mock';

export default function NewProductPage() {
    const { addProduct, categories } = useAdmin();
    const router = useRouter();

    const handleCreate = (product: Product) => {
        addProduct(product);
        router.push('/admin/inventory');
    };

    return (
        <div className="max-w-5xl mx-auto py-6">
            <ProductForm categories={categories} onSubmit={handleCreate} />
        </div>
    );
}
