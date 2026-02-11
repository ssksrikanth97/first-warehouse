import { Product, Category } from '@/lib/db-mock'
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Search, Edit2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Link from 'next/link'

interface InventoryViewProps {
    products: Product[]
    updateStock: (id: string, amount: number) => void
}

export function InventoryView({ products, updateStock }: InventoryViewProps) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
                    <p className="text-muted-foreground text-slate-500">Monitor and manage your product stock levels</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/inventory/new">
                        <Button className="bg-primary hover:bg-primary/90 h-10">
                            <Plus className="mr-2 h-4 w-4" /> Add New SKU
                        </Button>
                    </Link>
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
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {p.brand} • {typeof p.category === 'object' ? (p.category as any).name : p.category}
                                            </p>
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
                                    <Badge variant={p.isActive ? "default" : "secondary"} className={cn(p.isActive ? "bg-primary/10 text-primary/80 hover:bg-indigo-200" : "bg-slate-100 text-slate-500")}>
                                        {p.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/admin/inventory/${p.id}`}>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 text-slate-400 hover:text-primary"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
