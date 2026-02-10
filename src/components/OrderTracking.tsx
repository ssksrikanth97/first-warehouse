'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Package, Truck, CheckCircle2 } from 'lucide-react';

export interface Order {
    id: string;
    status: 'Confirmed' | 'Packed' | 'Out for Delivery' | 'Delivered';
    items: number;
    amount: number;
    date: string;
}

const mockOrders: Order[] = [
    { id: 'ORD-101', status: 'Out for Delivery', items: 12, amount: 1740, date: '2026-02-09' },
    { id: 'ORD-098', status: 'Delivered', items: 5, amount: 2100, date: '2026-02-07' },
];

export const OrderTracking = () => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Packed': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Out for Delivery': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Delivered': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusStep = (status: string) => {
        const steps = ['Confirmed', 'Packed', 'Out for Delivery', 'Delivered'];
        return steps.indexOf(status);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
            <div className="grid gap-4">
                {mockOrders.map(order => (
                    <Card key={order.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-sm font-bold text-indigo-600">{order.id}</CardTitle>
                                    <p className="text-xs text-slate-500 font-medium">{order.items} Items • ₹{order.amount.toLocaleString()}</p>
                                </div>
                                <Badge className={`text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="mt-4 flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-slate-100">
                                {[0, 1, 2, 3].map(step => (
                                    <div
                                        key={step}
                                        className={`flex-1 transition-all duration-500 ${step <= getStatusStep(order.status) ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                    />
                                ))}
                            </div>
                            <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                <span>Confirmed</span>
                                <span>Packed</span>
                                <span>Shipping</span>
                                <span>Arrived</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
