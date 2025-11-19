import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./src/routes/products";
import orderRoutes from "./src/routes/orders";
import adminRoutes from "./src/routes/admin";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Configure CORS properly
app.use(cors({
  origin: [
    'https://vermillion-strudel-6bb21d.netlify.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req: express.Request, res: express.Response) => {
  res.json({ 
    status: "Backend is running",
    database: "Supabase (PostgreSQL)"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Using Supabase database`);
});