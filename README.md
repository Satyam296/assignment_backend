# EMI Products Backend API

This repository contains the Backend API for the EMI products assignment - a comprehensive system for managing products, orders, and inventory with EMI (Equated Monthly Installment) support.

## 🚀 Demo Links

- **Frontend Demo**: https://vermillion-strudel-6bb21d.netlify.app/
- **Backend Repository**: https://github.com/Satyam296/assignment_backend.git

## 📋 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Email Service**: Nodemailer
- **Environment**: dotenv for configuration
- **CORS**: Enabled for cross-origin requests

## 🏗️ Database Schema

### Product Schema
```javascript
{
  slug: String (unique, required),
  name: String (required),
  category: String (required),
  description: String (required),
  variants: [{
    id: String,
    name: String,
    color: String,
    storage: String,
    price: Number,
    mrp: Number,
    image: String,
    images: [String],
    stock: Number (default: 10)
  }],
  emiPlans: [{
    id: String,
    tenure: Number,
    monthlyPayment: Number,
    interestRate: Number,
    cashback: Number,
    mutualFundName: String
  }],
  specifications: [{
    key: String,
    value: String
  }],
  downpaymentOptions: [{
    id: String,
    amount: Number,
    label: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  productId: String (required),
  productName: String (required),
  variantId: String (required),
  variantColor: String,
  variantStorage: String,
  variantPrice: Number (required),
  emiPlanId: String (required),
  emiTenure: Number (required),
  monthlyPayment: Number (required),
  interestRate: Number (required),
  cashback: Number,
  totalAmount: Number (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Schema
```javascript
{
  email: String (unique, required),
  password: String (required),
  name: String (required),
  notificationEnabled: Boolean (default: true),
  lowStockThreshold: Number (default: 5),
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Setup and Run Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Satyam296/assignment_backend.git
cd assignment_backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
# Copy the environment example file
cp .env.example .env

# Edit .env with your actual values
# Required variables:
# - MONGODB_URI: Your MongoDB connection string
# - PORT: Server port (default: 5000)
# - NODE_ENV: development/production
# - EMAIL_USER: Gmail account for notifications
# - EMAIL_PASSWORD: Gmail app password
# - FRONTEND_URL: Frontend application URL
```

4. **Database Setup**
```bash
# Seed the database with sample products
npm run seed
```

5. **Run the application**
```bash
# Development mode (with hot reload)
npm run dev

# Production mode (requires build first)
npm run build
npm start
```

The server will start at `http://localhost:5000`

## 📚 API Endpoints and Example Responses

### Health Check
```
GET /api/health
```
**Response:**
```json
{
  "status": "Backend is running"
}
```

### Products API

#### Get All Products
```
GET /api/products
```
**Response:**
```json
[
  {
    "_id": "product_id",
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
        "image": "https://example.com/image.jpg",
        "images": ["https://example.com/image1.jpg"]
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
      {"key": "Color", "value": "Silver"}
    ],
    "downpaymentOptions": [
      {"id": "dp1", "amount": 20235, "label": "₹20235"}
    ]
  }
]
```

#### Get Product by Slug
```
GET /api/products/:slug
```
**Response:** Single product object (same structure as above)

### Orders API

#### Create Order
```
POST /api/orders
```
**Request Body:**
```json
{
  "productId": "product_id",
  "productName": "Apple iPhone 17 Pro",
  "variantId": "v1",
  "variantColor": "Silver",
  "variantStorage": "256GB",
  "variantPrice": 134900,
  "emiPlanId": "p1",
  "emiTenure": 3,
  "monthlyPayment": 44967,
  "interestRate": 0,
  "cashback": 0
}
```
**Response:**
```json
{
  "message": "Order created successfully",
  "order": {
    "_id": "order_id",
    "productId": "product_id",
    "productName": "Apple iPhone 17 Pro",
    "variantId": "v1",
    "variantPrice": 134900,
    "totalAmount": 134901,
    "createdAt": "2025-11-09T12:00:00.000Z"
  },
  "stockRemaining": 7
}
```

#### Get All Orders
```
GET /api/orders
```
**Response:** Array of order objects

#### Get Order by ID
```
GET /api/orders/:id
```
**Response:** Single order object

### Admin API

#### Get Inventory
```
GET /api/admin/inventory
```
**Response:**
```json
[
  {
    "_id": "product_id",
    "slug": "iphone-17-pro",
    "name": "Apple iPhone 17 Pro",
    "category": "Smartphones",
    "variants": [
      {
        "id": "v1",
        "name": "Silver 256GB",
        "color": "Silver",
        "storage": "256GB",
        "stock": 8,
        "isLowStock": false
      }
    ],
    "totalStock": 48,
    "lowStockCount": 0,
    "variantCount": 6
  }
]
```

#### Get Low Stock Items
```
GET /api/admin/inventory/low-stock?threshold=5
```
**Response:**
```json
{
  "threshold": 5,
  "count": 1,
  "items": [
    {
      "productId": "product_id",
      "productName": "Apple iPhone 17 Pro",
      "variantId": "v2",
      "variantName": "Silver 512GB",
      "currentStock": 0,
      "price": 154900
    }
  ]
}
```

#### Update Stock
```
PUT /api/admin/inventory/update-stock
```
**Request Body:**
```json
{
  "productId": "product_id",
  "variantId": "v1",
  "newStock": 15
}
```
**Response:**
```json
{
  "message": "Stock updated successfully",
  "variant": {
    "id": "v1",
    "name": "Silver 256GB",
    "stock": 15
  }
}
```

#### Create Admin
```
POST /api/admin/admins
```
**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123",
  "name": "Admin User",
  "lowStockThreshold": 5
}
```

#### Send Test Email
```
POST /api/admin/test-email
```
**Request Body:**
```json
{
  "email": "test@example.com"
}
```

## 🎯 Key Features

- **Product Management**: Complete CRUD operations for products with variants
- **Order Processing**: Create and track orders with EMI calculations
- **Inventory Management**: Real-time stock tracking and low stock alerts
- **Email Notifications**: Automated alerts for low stock situations
- **Admin Dashboard**: Comprehensive inventory and order management
- **EMI Support**: Multiple EMI plans with different tenures and interest rates

## 🚀 Deployment

The application is ready for deployment on platforms like:
- **Render**: Recommended for backend deployment
- **Vercel**: For serverless deployment
- **Heroku**: Traditional PaaS deployment
- **Railway**: Modern deployment platform

### Environment Variables for Production
```
MONGODB_URI=your_production_mongodb_uri
PORT=5000
NODE_ENV=production
EMAIL_USER=your_gmail_account
EMAIL_PASSWORD=your_gmail_app_password
FRONTEND_URL=your_frontend_url
```

## 📝 Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server
npm run seed        # Seed database with sample data
```

## 📊 Database Seed Data

The application includes comprehensive seed data with:
- 3 premium smartphones (iPhone 17 Pro, Samsung S24 Ultra, Google Pixel 9 Pro)
- Multiple variants per product (different colors and storage options)
- 4 EMI plans with varying tenures (3, 6, 9, 12 months)
- Detailed product specifications
- High-quality product images
- Stock management with low stock scenarios

## 🔐 Security Considerations

- Environment variables for sensitive data
- Password hashing for admin accounts (implement in production)
- Input validation for all API endpoints
- CORS configuration for frontend integration
- Error handling and logging

## 🐛 Error Handling

The API includes comprehensive error handling:
- 400: Bad Request (missing fields, validation errors)
- 404: Not Found (product/order not found)
- 500: Internal Server Error (database/server issues)

All errors return JSON responses with descriptive messages.

---

**Note**: This project demonstrates a complete EMI products management system with features like inventory tracking, order management, and automated notifications. It's designed to showcase modern backend development practices with TypeScript, MongoDB, and Express.js.