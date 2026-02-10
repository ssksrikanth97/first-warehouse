import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import 'dotenv/config'

const libsql = createClient({
  url: 'file:dev.db',
})

async function main() {
  // Clear existing data (in reverse dependency order)
  await libsql.execute('DELETE FROM "Issue"');
  await libsql.execute('DELETE FROM "OrderItem"');
  await libsql.execute('DELETE FROM "Order"');
  await libsql.execute('DELETE FROM "Inventory"');
  await libsql.execute('DELETE FROM "PriceSlab"');
  await libsql.execute('DELETE FROM "Product"');
  await libsql.execute('DELETE FROM "User"');

  // Create Demo Admin
  await libsql.execute({
    sql: `INSERT OR REPLACE INTO User (id, phone, password, name, role, shopName, location, createdAt, updatedAt) 
          VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    args: ['u-demo-admin', '1234567890', 'password123', 'Demo Admin', 'ADMIN', 'Green Wholesale Hub', 'Bangalore, KA']
  });

  // Create Original Admin
  await libsql.execute({
    sql: `INSERT OR REPLACE INTO User (id, phone, password, name, role, shopName, location, createdAt, updatedAt) 
          VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    args: ['u-admin', '9999999999', 'password123', 'Main Distributor', 'ADMIN', 'Green Wholesale Hub', 'Bangalore, KA']
  });

  // Create Demo Retailer
  await libsql.execute({
    sql: `INSERT OR REPLACE INTO User (id, phone, password, name, role, shopName, location, creditLimit, outstandingBalance, createdAt, updatedAt) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    args: ['u-demo-retailer', '0987654321', 'password123', 'Demo Retailer', 'RETAILER', 'Demo Kirana Store', 'Indiranagar, Bangalore', 25000, 0]
  });

  // Create Original Retailer
  await libsql.execute({
    sql: `INSERT OR REPLACE INTO User (id, phone, password, name, role, shopName, location, creditLimit, outstandingBalance, createdAt, updatedAt) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    args: ['u-retailer', '8888888888', 'password123', 'Ramesh Kumar', 'RETAILER', 'Ramesh Kirana Store', 'HSR Layout, Bangalore', 50000, 0]
  });

  // Create Products
  const products = [
    {
      id: 'p1',
      name: 'Fortune Sunlite Refined Sunflower Oil',
      sku: 'OIL-FOR-1L',
      brand: 'Fortune',
      category: 'Edible Oil',
      basePrice: 145,
      minOrderQuantity: 12,
      unit: 'carton',
      description: '1 Litre Pouch',
    },
    {
      id: 'p2',
      name: 'Aashirvaad Whole Wheat Atta',
      sku: 'ATTA-AASH-10K',
      brand: 'Aashirvaad',
      category: 'Flour',
      basePrice: 420,
      minOrderQuantity: 5,
      unit: 'bag',
      description: '10kg Bag',
    },
    {
      id: 'p3',
      name: 'Maggi 2-Minute Noodles',
      sku: 'MAGGI-70G-P72',
      brand: 'Nestle',
      category: 'Instant Food',
      basePrice: 840,
      minOrderQuantity: 1,
      unit: 'carton',
      description: '70g x 72 packs',
    },
    {
      id: 'p4',
      name: 'Surf Excel Quick Wash',
      sku: 'SURF-EX-1K',
      brand: 'HUL',
      category: 'Detergent',
      basePrice: 190,
      minOrderQuantity: 10,
      unit: 'pack',
      description: '1kg Pack',
    },
  ]

  for (const p of products) {
    await libsql.execute({
      sql: `INSERT OR REPLACE INTO Product (id, name, sku, brand, category, basePrice, minOrderQuantity, unit, description, createdAt, updatedAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      args: [p.id, p.name, p.sku, p.brand, p.category, p.basePrice, p.minOrderQuantity, p.unit, p.description]
    });

    // Add inventory
    await libsql.execute({
      sql: `INSERT OR REPLACE INTO Inventory (id, productId, quantity, warehouseId, updatedAt) 
            VALUES (?, ?, ?, ?, datetime('now'))`,
      args: [`inv-${p.id}`, p.id, 500, 'main-wh']
    });

    // Add price slabs (approximate conversion of previous logic)
    await libsql.execute({
      sql: `DELETE FROM PriceSlab WHERE productId = ?`,
      args: [p.id]
    });
    await libsql.execute({
      sql: `INSERT INTO PriceSlab (id, productId, minQuantity, price) VALUES (?, ?, ?, ?)`,
      args: [`slab1-${p.id}`, p.id, p.minOrderQuantity, p.basePrice]
    });
    await libsql.execute({
      sql: `INSERT INTO PriceSlab (id, productId, minQuantity, price) VALUES (?, ?, ?, ?)`,
      args: [`slab2-${p.id}`, p.id, p.minOrderQuantity * 5, p.basePrice * 0.95]
    });
    await libsql.execute({
      sql: `INSERT INTO PriceSlab (id, productId, minQuantity, price) VALUES (?, ?, ?, ?)`,
      args: [`slab3-${p.id}`, p.id, p.minOrderQuantity * 10, p.basePrice * 0.90]
    });
  }

  console.log('Seed data created successfully using direct SQL')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    // libSql client doesn't need explicit disconnect in this script
  })
