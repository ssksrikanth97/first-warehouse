"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner' // Ensure sonner is installed

export default function NewCustomerPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        shopName: '',
        phone: '',
        location: '',
        // creditLimit: '25000'
    })

    const handleCreateRetailer = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast.success("Retailer created successfully")
                router.push('/admin/customers')
                router.refresh()
            } else {
                const err = await res.json()
                alert(err.error || "Failed to create retailer")
            }
        } catch (error) {
            console.error("Error creating retailer", error)
            alert("An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link href="/admin/customers">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Add New Retailer</h2>
                    <p className="text-slate-500 dark:text-slate-400">Onboard a new retailer to the platform</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Retailer Details</CardTitle>
                    <CardDescription>Enter the details for the new retailer account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateRetailer} className="space-y-6">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Ramesh Kumar"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email (Optional)</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="retailer@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="shopName">Shop Name</Label>
                                <Input
                                    id="shopName"
                                    placeholder="e.g. Ramesh Kirana Store"
                                    required
                                    value={formData.shopName}
                                    onChange={e => setFormData({ ...formData, shopName: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        placeholder="Mobile Number"
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="location">Location / Address</Label>
                                    <Input
                                        id="location"
                                        placeholder="Area, City"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="flex justify-end gap-2">
                            <Link href="/admin/customers">
                                <Button type="button" variant="outline">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Retailer Account
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
