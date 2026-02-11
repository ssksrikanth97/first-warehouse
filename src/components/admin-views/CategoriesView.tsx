import { Category } from '@/lib/db-mock'
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface CategoriesViewProps {
    categories: Category[]
    addCategory: (category: Category) => void
    updateCategory: (updatedCategory: Category) => void
}

export function CategoriesView({ categories, addCategory, updateCategory }: CategoriesViewProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [formData, setFormData] = useState<Partial<Category>>({})

    const handleOpenDialog = (category?: Category) => {
        if (category) {
            setEditingCategory(category)
            setFormData(category)
        } else {
            setEditingCategory(null)
            setFormData({
                id: Math.random().toString(36).substr(2, 9),
                status: 'Active',
                description: ''
            })
        }
        setIsDialogOpen(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingCategory) {
            updateCategory(formData as Category)
        } else {
            addCategory(formData as Category)
        }
        setIsDialogOpen(false)
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Categories</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage your product categorization</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90 h-10" onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Category
                </Button>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input placeholder="Search Categories..." className="pl-9" />
                </div>
            </div>

            <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 dark:bg-slate-800/50">
                            <TableHead>Category Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((cat) => (
                            <TableRow key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                <TableCell className="font-semibold text-slate-900 dark:text-slate-100">{cat.name}</TableCell>
                                <TableCell className="text-slate-500 text-sm max-w-[300px] truncate">{cat.description}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={cat.status === 'Active' ? 'secondary' : 'outline'}
                                        className={cat.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-slate-400'}
                                    >
                                        {cat.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-primary"
                                            onClick={() => handleOpenDialog(cat)}
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
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                        <DialogDescription>
                            Create or modify product categories here.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="cat-name">Category Name</Label>
                            <Input
                                id="cat-name"
                                value={formData.name || ''}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Edible Oils"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cat-desc">Description</Label>
                            <Input
                                id="cat-desc"
                                value={formData.description || ''}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description of the category"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cat-status">Status</Label>
                            <select
                                id="cat-status"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                                value={formData.status || 'Active'}
                                onChange={e => setFormData({ ...formData, status: e.target.value as 'Active' | 'Hidden' })}
                                required
                            >
                                <option value="Active">Active</option>
                                <option value="Hidden">Hidden</option>
                            </select>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-primary hover:bg-primary/90">
                                {editingCategory ? 'Save Changes' : 'Create Category'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
