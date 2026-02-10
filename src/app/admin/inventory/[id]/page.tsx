'use client';

import { useAdmin } from '@/context/AdminContext';
import { ProductForm } from '@/components/admin-views/ProductForm';
import { useRouter, useParams } from 'next/navigation';
import { Product } from '@/lib/db-mock';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function EditProductPage() {
    const { products, updateProduct, categories } = useAdmin();
    const router = useRouter();
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);

    // Explicitly destructure id to avoid direct property access on potentially proxied object later in effects
    // If params is a promise in this environment (unlikely for standard Client Component but possible with recent changes),
    // accessing it might be tricky. However, typically useParams() returns the object.
    // We will verify if we can access it safely.
    // Note: The error "params is a Promise" usually refers to the Page Props 'params'.
    // Since we are using the hook, let's try to access it cleanly.

    const id = params?.id;

    useEffect(() => {
        if (!id) return;
        const productId = Array.isArray(id) ? id[0] : id;

        const found = products.find(p => p.id === productId);
        if (found) {
            setProduct(found);
        }
    }, [products, id, router]);

    const handleUpdate = (updatedProduct: Product) => {
        updateProduct(updatedProduct);
        router.push('/admin/inventory');
    };

    if (!product) {
        return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
    }

    return (
        <div className="max-w-5xl mx-auto py-6">
            <ProductForm
                initialData={product}
                categories={categories}
                onSubmit={handleUpdate}
            />
        </div>
    );
}
