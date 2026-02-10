import { Product, Category } from '@/lib/db-mock'
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Search, Edit2, Loader2, Package } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface InventoryViewProps {
    products: Product[]
    updateStock: (id: string, amount: number) => void
    addProduct: (product: Product) => void
    updateProduct: (updatedProduct: Product) => void
    categories: Category[]
}

export function InventoryView({ products, updateStock, addProduct, updateProduct, categories }: InventoryViewProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [formData, setFormData] = useState<Partial<Product>>({})

    const handleOpenDialog = (product?: Product) => {
        if (product) {
            setEditingProduct(product)
            setFormData(product)
        } else {
            setEditingProduct(null)
            setFormData({
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
        }
        setIsDialogOpen(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingProduct) {
            updateProduct(formData as Product)
        } else {
            addProduct(formData as Product)
        }
        setIsDialogOpen(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
                    <p className="text-muted-foreground text-slate-500">Monitor and manage your product stock levels</p>
                </div>
                <div className="flex gap-2">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 h-10" onClick={() => handleOpenDialog()}>
                        <Plus className="mr-2 h-4 w-4" /> Add New SKU
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input placeholder="Search SKU or Product..." className="pl-9" />
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 dark:bg-slate-800/50">
                            <TableHead className="w-[300px]">Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Pricing</TableHead>
                            <TableHead>Stock Level</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map(p => (
                            <TableRow key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800" />
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{p.brand} • {p.category}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-mono text-[10px] bg-slate-50 dark:bg-slate-900">{p.sku}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                                        <p>{p.sellingUnit || p.unit}</p>
                                        <p className="text-[10px] text-slate-400">HSN: {p.hsnCode || '-'}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        <p className="font-bold text-slate-900 dark:text-slate-200">₹{p.wholesalePrice}</p>
                                        <p className="text-xs text-slate-500 line-through">MRP: ₹{p.mrp}</p>
                                        <p className="text-[10px] text-slate-400">GST: {p.gstPercentage}%</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <Badge
                                            variant={p.stock < 100 ? "destructive" : "secondary"}
                                            className={cn(
                                                "w-fit font-bold",
                                                p.stock >= 100 && "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                                            )}
                                        >
                                            {p.stock} {p.unit}s
                                        </Badge>
                                        <span className="text-[10px] text-slate-400">{p.warehouseId}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={p.isActive ? "default" : "secondary"} className={cn(p.isActive ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" : "bg-slate-100 text-slate-500")}>
                                        {p.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                                            onClick={() => handleOpenDialog(p)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                        <DialogDescription>
                            Enter the product details below.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="py-2">
                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-4">
                                <TabsTrigger value="basic">Basic Details</TabsTrigger>
                                <TabsTrigger value="pricing">Pricing & Tax</TabsTrigger>
                                <TabsTrigger value="inventory">Inventory & Logistics</TabsTrigger>
                            </TabsList>

                            <TabsContent value="basic" className="space-y-4">
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
                                    <Label htmlFor="image">Product Image URL</Label>
                                    <Input id="image" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} />
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
                            </TabsContent>

                            <TabsContent value="pricing" className="space-y-4">
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
                            </TabsContent>

                            <TabsContent value="inventory" className="space-y-4">
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
                            </TabsContent>
                        </Tabs>

                        <DialogFooter className="pt-4 mt-6 border-t border-slate-100">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                                {editingProduct ? 'Save Changes' : 'Create Product'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
