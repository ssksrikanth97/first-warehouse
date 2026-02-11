// Mock Database Layer
// To be replaced by Prisma once configuration is stable

export interface Product {
    id: string;
    sku: string;
    name: string;
    category: string;
    brand: string;
    unit: string; // Unit Type (e.g., Carton, Pack)
    unitsPerPack: number;
    sellingUnit: string; // e.g., "10kg Bag", "1L Pouch"
    mrp: number;
    wholesalePrice: number;
    minOrderQuantity: number;
    stock: number;
    warehouseId: string;
    gstPercentage: number;
    hsnCode: string;
    image: string;
    isActive: boolean;
    description: string; // Keeping for backward compatibility or extra details
}

export const mockProducts: Product[] = [
    {
        id: "1",
        name: "Fortune Sunflower Oil",
        sku: "OIL-FOR-1L",
        brand: "Fortune",
        category: "Edible Oil",
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop",
        description: "1 Litre Pouch, Refined Sunflower Oil",
        sellingUnit: "1 Litre Pouch",
        unit: "carton",
        unitsPerPack: 10,
        mrp: 160,
        wholesalePrice: 145,
        minOrderQuantity: 12,
        stock: 450,
        warehouseId: "WH-001",
        gstPercentage: 5,
        hsnCode: "15121110",
        isActive: true
    },
    {
        id: "2",
        name: "Aashirvaad Atta",
        sku: "ATTA-AASH-10K",
        brand: "Aashirvaad",
        category: "Flour",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop",
        description: "10kg Bag, Whole Wheat Flour",
        sellingUnit: "10kg Bag",
        unit: "bag",
        unitsPerPack: 1,
        mrp: 450,
        wholesalePrice: 420,
        minOrderQuantity: 5,
        stock: 120,
        warehouseId: "WH-001",
        gstPercentage: 0,
        hsnCode: "11010000",
        isActive: true
    },
    {
        id: "3",
        name: "Maggi Noodles",
        sku: "MAGGI-P72",
        brand: "Nestle",
        category: "Instant Food",
        image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=200&h=200&fit=crop",
        description: "70g x 72 packs, Masala Flavour",
        sellingUnit: "70g Pack",
        unit: "carton",
        unitsPerPack: 72,
        mrp: 960,
        wholesalePrice: 840,
        minOrderQuantity: 1,
        stock: 85,
        warehouseId: "WH-002",
        gstPercentage: 12,
        hsnCode: "19023010",
        isActive: true
    },
    {
        id: "4",
        name: "Surf Excel Wash",
        sku: "SURF-EX-1K",
        brand: "HUL",
        category: "Detergent",
        image: "https://images.unsplash.com/photo-1545184180-25d471fe75eb?w=200&h=200&fit=crop",
        description: "1kg Pack, Quick Wash Powder",
        sellingUnit: "1kg Pack",
        unit: "pack",
        unitsPerPack: 10,
        mrp: 210,
        wholesalePrice: 190,
        minOrderQuantity: 10,
        stock: 300,
        warehouseId: "WH-002",
        gstPercentage: 18,
        hsnCode: "34029011",
        isActive: true
    },
];

export interface User {
    id: string;
    phone: string;
    password?: string;
    name: string;
    role: 'RETAILER' | 'ADMIN' | 'SUPER_ADMIN';
    shopName?: string;
    email?: string;
    location?: string;
    isActive?: boolean;
    customFields?: any;
}

export const mockUsers: User[] = [
    { id: "u1", phone: "1234567890", password: "password123", name: "Demo Admin", role: "ADMIN" },
    { id: "u2", phone: "0987654321", password: "password123", name: "Demo Retailer", shopName: "Demo Kirana", role: "RETAILER" },
    { id: "u3", phone: "9999999999", password: "password123", name: "Distributor Pro", role: "ADMIN" },
    { id: "u4", phone: "8888888888", password: "password123", name: "Ramesh Kumar", shopName: "Ramesh Kirana", role: "RETAILER" },
];

export interface Category {
    id: string;
    name: string;
    description: string;
    image?: string;
    status: 'Active' | 'Hidden';
}

export const mockCategories: Category[] = [
    { id: '1', name: 'Edible Oil', description: 'Cooking oils, ghee, and vanaspati', status: 'Active' },
    { id: '2', name: 'Flour & Atta', description: 'Wheat flour, gram flour, and others', status: 'Active' },
    { id: '3', name: 'Instant Food', description: 'Noodles, pasta, and ready-to-eat', status: 'Active' },
    { id: '4', name: 'Detergent', description: 'Washing powders and liquids', status: 'Hidden' },
    { id: '5', name: 'Personal Care', description: 'Soaps, shampoos, and oral care', status: 'Active' },
];

export const db = {
    products: {
        findMany: async () => mockProducts,
        findOne: async (id: string) => mockProducts.find(p => p.id === id),
    },
    users: {
        findByPhone: async (phone: string) => mockUsers.find(u => u.phone === phone),
    },
    categories: {
        findMany: async () => mockCategories,
    }
};
