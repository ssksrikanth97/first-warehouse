import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Start seeding ...')

  // Clear existing data (in reverse dependency order)
  // deleteMany without args deletes all
  await prisma.issue.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.inventory.deleteMany()
  await prisma.priceSlab.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()
  await prisma.category.deleteMany()

  // Create Categories
  const categories = [
    { name: 'Edible Oil', description: 'Cooking oils, ghee, and vanaspati', status: 'Active' },
    { name: 'Flour', description: 'Wheat flour, gram flour, and others', status: 'Active' },
    { name: 'Instant Food', description: 'Noodles, pasta, and ready-to-eat', status: 'Active' },
    { name: 'Detergent', description: 'Washing powders and liquids', status: 'Hidden' },
    { name: 'Personal Care', description: 'Soaps, shampoos, and oral care', status: 'Active' },
  ]

  const categoryMap = new Map()

  for (const cat of categories) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        description: cat.description,
        status: cat.status,
      }
    })
    categoryMap.set(cat.name, created.id)
  }

  // Create Users
  const users = [
    {
      id: 'u-demo-admin',
      phone: '1234567890',
      password: 'password123',
      name: 'Demo Admin',
      role: 'ADMIN',
      shopName: 'Green Wholesale Hub',
      location: 'Bangalore, KA'
    },
    {
      id: 'u-admin',
      phone: '9999999999',
      password: 'password123',
      name: 'Main Distributor',
      role: 'ADMIN',
      shopName: 'Green Wholesale Hub',
      location: 'Bangalore, KA'
    },
    {
      id: 'u-demo-retailer',
      phone: '0987654321',
      password: 'password123',
      name: 'Demo Retailer',
      role: 'RETAILER',
      shopName: 'Demo Kirana Store',
      location: 'Indiranagar, Bangalore',
      creditLimit: 25000,
      outstandingBalance: 0
    },
    {
      id: 'u-retailer',
      phone: '8888888888',
      password: 'password123',
      name: 'Ramesh Kumar',
      role: 'RETAILER',
      shopName: 'Ramesh Kirana Store',
      location: 'HSR Layout, Bangalore',
      creditLimit: 50000,
      outstandingBalance: 0
    }
  ]

  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id,
        phone: u.phone,
        password: u.password,
        name: u.name,
        role: u.role,
        shopName: u.shopName,
        location: u.location,
        creditLimit: u.creditLimit,
        outstandingBalance: u.outstandingBalance
      }
    })
  }

  // Create Products
  const products = [
    {
      name: 'Fortune Sunlite Refined Sunflower Oil',
      sku: 'OIL-FOR-1L',
      brand: 'Fortune',
      category: 'Edible Oil',
      wholesalePrice: 145,
      mrp: 160,
      minOrderQuantity: 12,
      unit: 'carton',
      description: '1 Litre Pouch',
      sellingUnit: '1 Litre Pouch',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop',
      unitsPerPack: 10,
      gstPercentage: 5,
      hsnCode: '15121110'
    },
    {
      name: 'Aashirvaad Whole Wheat Atta',
      sku: 'ATTA-AASH-10K',
      brand: 'Aashirvaad',
      category: 'Flour',
      wholesalePrice: 420,
      mrp: 450,
      minOrderQuantity: 5,
      unit: 'bag',
      description: '10kg Bag',
      sellingUnit: '10kg Bag',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop',
      unitsPerPack: 1,
      gstPercentage: 0,
      hsnCode: '11010000'
    },
    {
      name: 'Maggi 2-Minute Noodles',
      sku: 'MAGGI-70G-P72',
      brand: 'Nestle',
      category: 'Instant Food',
      wholesalePrice: 840,
      mrp: 960,
      minOrderQuantity: 1,
      unit: 'carton',
      description: '70g x 72 packs',
      sellingUnit: '70g Pack',
      image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=200&h=200&fit=crop',
      unitsPerPack: 72,
      gstPercentage: 12,
      hsnCode: '19023010'
    },
    {
      name: 'Surf Excel Quick Wash',
      sku: 'SURF-EX-1K',
      brand: 'HUL',
      category: 'Detergent',
      wholesalePrice: 190,
      mrp: 210,
      minOrderQuantity: 10,
      unit: 'pack',
      description: '1kg Pack',
      sellingUnit: '1kg Pack',
      image: 'https://images.unsplash.com/photo-1545184180-25d471fe75eb?w=200&h=200&fit=crop',
      unitsPerPack: 10,
      gstPercentage: 18,
      hsnCode: '34029011'
    }
  ]

  for (const p of products) {
    const catId = categoryMap.get(p.category)
    if (!catId) continue

    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        name: p.name,
        sku: p.sku,
        brand: p.brand,
        categoryId: catId,
        wholesalePrice: p.wholesalePrice,
        mrp: p.mrp,
        minOrderQuantity: p.minOrderQuantity,
        unit: p.unit,
        description: p.description,
        sellingUnit: p.sellingUnit,
        image: p.image,
        unitsPerPack: p.unitsPerPack,
        gstPercentage: p.gstPercentage,
        hsnCode: p.hsnCode,
        inventory: {
          create: {
            warehouseId: 'WH-001',
            quantity: 500
          }
        },
        priceSlabs: {
          create: [
            { minQuantity: p.minOrderQuantity, price: p.wholesalePrice },
            { minQuantity: p.minOrderQuantity * 5, price: p.wholesalePrice * 0.95 },
            { minQuantity: p.minOrderQuantity * 10, price: p.wholesalePrice * 0.90 }
          ]
        }
      }
    })
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
