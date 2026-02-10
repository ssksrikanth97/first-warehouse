"use client"

import { CategoriesView } from '@/components/admin-views/CategoriesView';
import { useAdmin } from '@/context/AdminContext';

export default function CategoriesPage() {
    const { categories, addCategory, updateCategory } = useAdmin();

    return (
        <CategoriesView
            categories={categories}
            addCategory={addCategory}
            updateCategory={updateCategory}
        />
    );
}
