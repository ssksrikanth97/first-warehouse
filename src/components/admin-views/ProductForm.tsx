"use client"

import { useState } from 'react'
import { Product, Category } from '@/lib/db-mock'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft } from 'lucide-react'

interface ProductFormProps {
    initialData?: Product
    categories: Category[]
    onSubmit: (product: Product) => void
    isSubmitting?: boolean
}

export function ProductForm({ initialData, categories, onSubmit, isSubmitting = false }: ProductFormProps) {
    const router = useRouter()
    const [formData, setFormData] = useState<Partial<Product>>(initialData || {
        id: Math.random().toString(36).substr(2, 9),
        stock: 0,
        unit: 'piece',
        minOrderQuantity: 1,
        isActive: true,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop',
        gstPercentage: 0,
        unitsPerPack: 1,
        warehouseId: 'WH-001'
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData as Product)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-10">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()} type="button">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{initialData ? 'Edit Product' : 'Create New Product'}</h1>
                    <p className="text-muted-foreground">Fill in the details below to {initialData ? 'update the' : 'add a new'} product.</p>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button variant="outline" onClick={() => router.back()} type="button">Cancel</Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? 'Save Changes' : 'Create Product'}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="basic">Basic Details</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing & Tax</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory & Logistics</TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Core product details and categorization.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name *</Label>
                                    <Input id="name" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sku">SKU Code *</Label>
                                    <Input id="sku" value={formData.sku || ''} onChange={e => setFormData({ ...formData, sku: e.target.value })} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="brand">Brand *</Label>
                                    <Input id="brand" value={formData.brand || ''} onChange={e => setFormData({ ...formData, brand: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <select
                                        id="category"
                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950"
                                        value={formData.category || ''}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Product Image</Label>
                                <div className="flex items-center gap-4">
                                    <div className="relative h-20 w-20 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
                                        {formData.image ? (
                                            <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                <span className="text-xs">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setFormData({ ...formData, image: reader.result as string });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        <p className="text-[10px] text-muted-foreground mt-1">
                                            Supported formats: JPG, PNG, WebP. Max size: 2MB.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input id="description" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="isActive">Active Status</Label>
                                <select
                                    id="isActive"
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                    value={formData.isActive ? 'true' : 'false'}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pricing">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing & Taxation</CardTitle>
                            <CardDescription>Manage costs, prices, and tax rates.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="mrp">MRP (₹) *</Label>
                                    <Input id="mrp" type="number" value={formData.mrp || ''} onChange={e => setFormData({ ...formData, mrp: parseFloat(e.target.value) })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="wholesalePrice">Wholesale Price (₹) *</Label>
                                    <Input id="wholesalePrice" type="number" value={formData.wholesalePrice || ''} onChange={e => setFormData({ ...formData, wholesalePrice: parseFloat(e.target.value) })} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="gstPercentage">GST Percentage (%)</Label>
                                    <Input id="gstPercentage" type="number" value={formData.gstPercentage || 0} onChange={e => setFormData({ ...formData, gstPercentage: parseFloat(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hsnCode">HSN Code</Label>
                                    <Input id="hsnCode" value={formData.hsnCode || ''} onChange={e => setFormData({ ...formData, hsnCode: e.target.value })} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="inventory">
                    <Card>
                        <CardHeader>
                            <CardTitle>Inventory & Logistics</CardTitle>
                            <CardDescription>Manage stock levels, units, and warehouse details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Available Stock *</Label>
                                    <Input id="stock" type="number" value={formData.stock || 0} onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="warehouseId">Warehouse ID</Label>
                                    <Input id="warehouseId" value={formData.warehouseId || ''} onChange={e => setFormData({ ...formData, warehouseId: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="minOrderQuantity">Min Order Qty (MOQ) *</Label>
                                    <Input id="minOrderQuantity" type="number" value={formData.minOrderQuantity || 1} onChange={e => setFormData({ ...formData, minOrderQuantity: parseInt(e.target.value) })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="unit">Unit Type *</Label>
                                    <select
                                        id="unit"
                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                        value={formData.unit || 'piece'}
                                        onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                        required
                                    >
                                        <option value="piece">Piece</option>
                                        <option value="pack">Pack</option>
                                        <option value="carton">Carton</option>
                                        <option value="bag">Bag</option>
                                        <option value="box">Box</option>
                                        <option value="bottle">Bottle</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="unitsPerPack">Units per Pack</Label>
                                    <Input id="unitsPerPack" type="number" value={formData.unitsPerPack || 1} onChange={e => setFormData({ ...formData, unitsPerPack: parseInt(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sellingUnit">Selling Unit Description</Label>
                                    <Input id="sellingUnit" placeholder="e.g. 10kg Bag" value={formData.sellingUnit || ''} onChange={e => setFormData({ ...formData, sellingUnit: e.target.value })} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </form>
    )
}
