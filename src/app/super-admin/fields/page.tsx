'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

interface CustomField {
    id: string;
    entityType: string;
    name: string;
    key: string;
    type: string;
    required: boolean;
    visible: boolean;
    options?: any;
}

export default function FieldConfigurationPage() {
    const [fields, setFields] = useState<CustomField[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('PRODUCT');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // New Field State
    const [newField, setNewField] = useState<Partial<CustomField>>({
        type: 'TEXT',
        required: false,
        visible: true
    });

    const loadFields = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/super/fields?entityType=${activeTab}`);
            if (res.ok) {
                setFields(await res.json());
            }
        } catch (error) {
            toast.error('Failed to load fields');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFields();
    }, [activeTab]);

    const handleCreateField = async () => {
        try {
            const res = await fetch('/api/super/fields', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newField,
                    entityType: activeTab
                })
            });

            if (res.ok) {
                toast.success('Field created successfully');
                setIsDialogOpen(false);
                setNewField({ type: 'TEXT', required: false, visible: true });
                loadFields();
            } else {
                const err = await res.json();
                toast.error(err.error || 'Failed to create field');
            }
        } catch (error) {
            toast.error('Error creating field');
        }
    };

    const handleDeleteField = async (id: string) => {
        if (!confirm('Are you sure? This will delete the field definition but not the data already stored.')) return;

        try {
            const res = await fetch(`/api/super/fields?id=${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success('Field deleted');
                loadFields();
            }
        } catch (error) {
            toast.error('Error deleting field');
        }
    };

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Advanced Field Configuration</h2>
                    <p className="text-slate-500">Manage custom fields for your data models.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Field
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Custom Field</DialogTitle>
                            <DialogDescription>
                                Add a new field to the {activeTab} entity.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Display Name</Label>
                                    <Input
                                        placeholder="e.g. GST Number"
                                        value={newField.name || ''}
                                        onChange={e => {
                                            const name = e.target.value;
                                            // Auto-generate key from name
                                            const key = name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
                                            setNewField(prev => ({ ...prev, name, key }));
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Field Key (Internal ID)</Label>
                                    <Input
                                        placeholder="e.g. GST_NUMBER"
                                        value={newField.key || ''}
                                        onChange={e => setNewField(prev => ({ ...prev, key: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '') }))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Field Type</Label>
                                <Select
                                    value={newField.type || 'TEXT'}
                                    onValueChange={val => setNewField(prev => ({ ...prev, type: val }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TEXT">Text</SelectItem>
                                        <SelectItem value="NUMBER">Number</SelectItem>
                                        <SelectItem value="BOOLEAN">Yes/No (Boolean)</SelectItem>
                                        <SelectItem value="DATE">Date</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
                                <Label>Required Field</Label>
                                <Switch
                                    checked={newField.required}
                                    onCheckedChange={checked => setNewField(prev => ({ ...prev, required: checked }))}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreateField}>Create Field</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="PRODUCT">Products</TabsTrigger>
                    <TabsTrigger value="USER">Customers (Users)</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>{activeTab === 'PRODUCT' ? 'Product' : 'Customer'} Fields</CardTitle>
                            <CardDescription>
                                Currently configured custom fields.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {fields.length === 0 ? (
                                <div className="text-center py-10 text-slate-500">
                                    No custom fields configured.
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Field Name</TableHead>
                                            <TableHead>Key</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Required</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fields.map((field) => (
                                            <TableRow key={field.id}>
                                                <TableCell className="font-medium">{field.name}</TableCell>
                                                <TableCell className="font-mono text-xs">{field.key}</TableCell>
                                                <TableCell>{field.type}</TableCell>
                                                <TableCell>{field.required ? 'Yes' : 'No'}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDeleteField(field.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
