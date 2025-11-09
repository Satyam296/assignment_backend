# Database Schema Documentation

## Overview
The EMI Products system uses MongoDB with Mongoose ODM. The database consists of three main collections:

## Collections

### 1. Products Collection
Stores all product information including variants, EMI plans, and specifications.

```javascript
{
  _id: ObjectId,
  slug: String,           // Unique identifier for URLs (e.g., "iphone-17-pro")
  name: String,           // Product display name
  category: String,       // Product category (e.g., "Smartphones")
  description: String,    // Product description
  variants: [...],        // Array of product variants
  emiPlans: [...],       // Array of available EMI plans
  specifications: [...], // Array of product specifications
  downpaymentOptions: [...], // Array of downpayment options
  createdAt: Date,
  updatedAt: Date
}
```

#### Variants Subdocument
```javascript
{
  id: String,           // Variant identifier
  name: String,         // Variant name (e.g., "Silver 256GB")
  color: String,        // Color option
  storage: String,      // Storage capacity
  price: Number,        // Current selling price
  mrp: Number,          // Maximum retail price
  image: String,        // Primary image URL
  images: [String],     // Array of additional image URLs
  stock: Number         // Available inventory count
}
```

#### EMI Plans Subdocument
```javascript
{
  id: String,           // Plan identifier
  tenure: Number,       // Duration in months
  monthlyPayment: Number, // Calculated monthly payment
  interestRate: Number, // Annual interest rate percentage
  cashback: Number,     // Cashback amount
  mutualFundName: String // Associated financial institution
}
```

#### Specifications Subdocument
```javascript
{
  key: String,          // Specification name (e.g., "Storage")
  value: String         // Specification value (e.g., "256 GB")
}
```

#### Downpayment Options Subdocument
```javascript
{
  id: String,           // Option identifier
  amount: Number,       // Downpayment amount
  label: String         // Display label (e.g., "₹20235")
}
```

### 2. Orders Collection
Stores customer orders with EMI details.

```javascript
{
  _id: ObjectId,
  productId: String,        // Reference to product._id
  productName: String,      // Product name (denormalized)
  variantId: String,        // Selected variant ID
  variantColor: String,     // Selected color
  variantStorage: String,   // Selected storage
  variantPrice: Number,     // Price at time of order
  emiPlanId: String,        // Selected EMI plan ID
  emiTenure: Number,        // EMI duration in months
  monthlyPayment: Number,   // Monthly payment amount
  interestRate: Number,     // Interest rate applied
  cashback: Number,         // Cashback amount
  totalAmount: Number,      // Total payable amount
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Admins Collection
Stores admin user information and notification preferences.

```javascript
{
  _id: ObjectId,
  email: String,              // Admin email (unique)
  password: String,           // Encrypted password
  name: String,               // Admin display name
  notificationEnabled: Boolean, // Email notification preference
  lowStockThreshold: Number,   // Stock level for alerts
  createdAt: Date,
  updatedAt: Date
}
```

## Relationships

### Product → Order
- Orders reference products by `productId`
- Variant information is denormalized in orders for historical accuracy

### Admin → Notifications
- Admins receive low stock alerts when product variants fall below their threshold
- Notifications are sent via email service

## Indexes

Recommended indexes for performance:

```javascript
// Products
db.products.createIndex({ slug: 1 }, { unique: true })
db.products.createIndex({ category: 1 })
db.products.createIndex({ "variants.stock": 1 })

// Orders
db.orders.createIndex({ productId: 1 })
db.orders.createIndex({ createdAt: -1 })

// Admins
db.admins.createIndex({ email: 1 }, { unique: true })
```

## Sample Data Structure

### Product Example
```json
{
  "_id": "673f1234567890abcdef1234",
  "slug": "iphone-17-pro",
  "name": "Apple iPhone 17 Pro",
  "category": "Smartphones",
  "description": "Latest Apple flagship smartphone with advanced features",
  "variants": [
    {
      "id": "v1",
      "name": "Silver 256GB",
      "color": "Silver",
      "storage": "256GB",
      "price": 134900,
      "mrp": 149900,
      "stock": 8,
      "image": "https://example.com/iphone-silver.jpg",
      "images": ["https://example.com/iphone-silver-1.jpg"]
    }
  ],
  "emiPlans": [
    {
      "id": "p1",
      "tenure": 3,
      "interestRate": 0,
      "cashback": 0,
      "mutualFundName": "ICICI Bank"
    }
  ],
  "specifications": [
    {"key": "Storage", "value": "256 GB"},
    {"key": "Color", "value": "Silver"},
    {"key": "Screen Size", "value": "6.3 inch"}
  ],
  "downpaymentOptions": [
    {"id": "dp1", "amount": 20235, "label": "₹20235"},
    {"id": "dp2", "amount": 40470, "label": "₹40470"}
  ],
  "createdAt": "2025-11-09T10:30:00.000Z",
  "updatedAt": "2025-11-09T10:30:00.000Z"
}
```

### Order Example
```json
{
  "_id": "673f5678901234abcdef5678",
  "productId": "673f1234567890abcdef1234",
  "productName": "Apple iPhone 17 Pro",
  "variantId": "v1",
  "variantColor": "Silver",
  "variantStorage": "256GB",
  "variantPrice": 134900,
  "emiPlanId": "p1",
  "emiTenure": 3,
  "monthlyPayment": 44967,
  "interestRate": 0,
  "cashback": 0,
  "totalAmount": 134901,
  "createdAt": "2025-11-09T11:00:00.000Z",
  "updatedAt": "2025-11-09T11:00:00.000Z"
}
```

## Data Validation

### Mongoose Validation Rules
- Required fields are enforced at schema level
- Unique constraints on `slug` and `email`
- Default values for `stock`, `notificationEnabled`, `lowStockThreshold`
- Timestamps automatically managed

### Business Rules
- Stock decrements when orders are created
- Low stock alerts triggered when stock < admin threshold
- EMI calculations validated on frontend before order creation
- Email notifications sent asynchronously

## Migration Considerations

When updating schema:
1. Always use migrations for production databases
2. Maintain backward compatibility where possible
3. Update seed data to match new schema
4. Test migrations on staging environment first