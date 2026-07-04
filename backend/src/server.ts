import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Razorpay from "razorpay";
import dbConnect from "./lib/mongodb";
import User from "./models/User";
import Product from "./models/Product";
import Order from "./models/Order";
import { seedDatabase } from "./lib/seed";

interface NominatimReverseResponse {
  display_name?: string;
  address?: {
    road?: string;
    suburb?: string;
    neighbourhood?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

interface TurnstileVerifyResponse {
  success?: boolean;
  [key: string]: unknown;
}

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const GATEWAY_SECRET = process.env.GATEWAY_SECRET || "purple-beans-gateway-jwt-signature-secret-key-2026";

// Enable CORS
app.use(cors());
app.use(express.json());

// Gateway Verification Middleware: ensures requests come through the Next.js gateway
const verifyGateway = (req: Request, res: Response, next: NextFunction): void => {
  const secret = req.headers["x-gateway-secret"];
  // For credentials login, NextAuth calls directly, so we allow it if verified
  if (!secret || secret !== GATEWAY_SECRET) {
    res.status(401).json({ success: false, error: "Direct access to backend API is unauthorized" });
    return;
  }
  next();
};

// Helper middleware to verify admin requests
const verifyAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const userRole = req.headers["x-user-role"];
  if (userRole !== "admin") {
    res.status(403).json({ success: false, error: "Forbidden: Admin access required" });
    return;
  }
  next();
};

// Helper middleware to verify authenticated user requests
const verifyAuth = (req: Request, res: Response, next: NextFunction): void => {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    res.status(401).json({ success: false, error: "Unauthorized: Please log in" });
    return;
  }
  next();
};

// Apply Gateway verification globally
app.use(verifyGateway);

// ==========================================
// 1. AUTHENTICATION ENDPOINTS
// ==========================================

// POST /api/auth/register - Register new credentials-based user
app.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ success: false, error: "Missing required fields" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, error: "Password must be at least 6 characters long" });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, error: "Email is already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "customer",
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/login - Validate credentials login
app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password) {
      res.status(400).json({ success: false, error: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ success: false, error: "Invalid email or password" });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image || null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/google-login - Sync Google user details on login
app.post("/api/auth/google-login", async (req: Request, res: Response) => {
  try {
    const { name, email, image } = req.body;
    if (!email) {
      res.status(400).json({ success: false, error: "Email is required" });
      return;
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await User.create({
        name: name || "",
        email: email.toLowerCase(),
        image: image || "",
        role: "customer",
      });
    } else {
      if (image && user.image !== image) {
        user.image = image;
        await user.save();
      }
    }

    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image || null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 2. PRODUCTS ENDPOINTS
// ==========================================

// GET /api/products - Get all active products
app.get("/api/products", async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/products/:id - Get single active product
app.get("/api/products/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ productId: req.params.id, isActive: true });
    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }
    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/products - Add product (Admin only)
app.post("/api/products", verifyAdmin, async (req: Request, res: Response) => {
  try {
    const existingProduct = await Product.findOne({ productId: req.body.productId });
    if (existingProduct) {
      res.status(400).json({ success: false, error: "Product ID already exists" });
      return;
    }

    const product = await Product.create({
      ...req.body,
      inStock: req.body.stockQuantity > 0,
    });

    res.status(201).json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/products/:id - Edit product (Admin only)
app.patch("/api/products/:id", verifyAdmin, async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    Object.assign(product, req.body);
    if (typeof req.body.stockQuantity !== "undefined") {
      product.inStock = req.body.stockQuantity > 0;
    }

    await product.save();
    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/products/:id - Soft-delete product (Admin only)
app.delete("/api/products/:id", verifyAdmin, async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    product.isActive = false;
    await product.save();
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 3. ORDERS ENDPOINTS
// ==========================================

// GET /api/orders - Get orders (Admin gets all, Customer gets own)
app.get("/api/orders", verifyAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const userRole = req.headers["x-user-role"] as string;

    let orders;
    if (userRole === "admin") {
      orders = await Order.find({}).sort({ createdAt: -1 }).populate("user", "name email");
    } else {
      orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    }

    res.json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/orders - Place a new order
app.post("/api/orders", verifyAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const userEmail = req.headers["x-user-email"] as string;
    const userName = req.headers["x-user-name"] as string;

    const { items, shippingAddress, paymentMethod, notes, razorpayOrderId } = req.body;

    if (!items || items.length === 0 || !shippingAddress) {
      res.status(400).json({ success: false, error: "Missing required fields" });
      return;
    }

    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const dbProduct = await Product.findOne({ productId: item.productId });
      if (!dbProduct || !dbProduct.isActive) {
        res.status(400).json({ success: false, error: `Product ${item.name} is no longer available` });
        return;
      }

      if (dbProduct.stockQuantity < item.quantity) {
        res.status(400).json({ success: false, error: `Insufficient stock for ${item.name}` });
        return;
      }

      // Deduct stock
      dbProduct.stockQuantity -= item.quantity;
      if (dbProduct.stockQuantity <= 0) {
        dbProduct.inStock = false;
      }
      await dbProduct.save();

      totalAmount += dbProduct.price * item.quantity;
      validatedItems.push({
        product: dbProduct._id,
        productId: item.productId,
        name: dbProduct.name,
        image: dbProduct.image,
        price: dbProduct.price,
        quantity: item.quantity,
        grind: item.grind || "Whole Beans",
        weight: item.weight || "250g",
      });
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
    const orderId = `PB-${dateStr}-${randomSuffix}`;

    const orderData = {
      orderId,
      user: userId,
      customerName: userName || "Customer",
      customerEmail: userEmail || "",
      customerPhone: shippingAddress.phone || "",
      items: validatedItems,
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state || "",
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || "India",
      },
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "placed",
      totalAmount,
      notes,
      razorpayOrderId: paymentMethod === "razorpay" ? razorpayOrderId : undefined,
    };

    const order = await Order.create(orderData);
    res.status(201).json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/orders/:id - Get single order details
app.get("/api/orders/:id", verifyAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const userRole = req.headers["x-user-role"] as string;

    const order = await Order.findOne({ orderId: req.params.id }).populate("user", "name email");
    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }

    // Owner or Admin only
    if (userRole !== "admin" && order.user._id.toString() !== userId) {
      res.status(401).json({ success: false, error: "Unauthorized access to order details" });
      return;
    }

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/orders/:id - Update order status (Admin only)
app.patch("/api/orders/:id", verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { orderStatus, paymentStatus, notes } = req.body;
    const order = await Order.findOne({ orderId: req.params.id });

    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (notes) order.notes = notes;

    await order.save();
    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 4. PAYMENTS (RAZORPAY)
// ==========================================

// POST /api/payment/create-order - Create Razorpay prepaid order
app.post("/api/payment/create-order", verifyAuth, async (req: Request, res: Response) => {
  try {
    const { amount, receipt } = req.body;
    if (!amount) {
      res.status(400).json({ success: false, error: "Amount is required" });
      return;
    }

    const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/payment/verify - Verify Razorpay payment signature
app.post("/api/payment/verify", verifyAuth, async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      res.status(400).json({ success: false, error: "Missing verification parameters" });
      return;
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const order = await Order.findOne({ orderId });
      if (!order) {
        res.status(404).json({ success: false, error: "Order not found" });
        return;
      }

      order.paymentStatus = "paid";
      order.razorpayPaymentId = razorpay_payment_id;
      order.orderStatus = "confirmed";
      await order.save();

      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, error: "Invalid payment signature" });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 5. GEOLOCATION & CAPTCHA PROXIES
// ==========================================

// GET /api/location - Nominatim OSM reverse geocoding API proxy
app.get("/api/location", async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      res.status(400).json({ error: "Latitude and longitude are required" });
      return;
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
      {
        headers: {
          "User-Agent": "Purple-Beans-B2B-App/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch address from Nominatim");
    }

    const data = (await response.json()) as NominatimReverseResponse;
    const address = data.address || {};

    res.json({
      success: true,
      address: {
        raw: data.display_name,
        road: address.road || "",
        suburb: address.suburb || address.neighbourhood || "",
        city: address.city || address.town || address.village || "",
        state: address.state || "",
        postcode: address.postcode || "",
        country: address.country || "",
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/turnstile - Cloudflare Turnstile token validation proxy
app.post("/api/turnstile", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ success: false, error: "Token is required" });
      return;
    }

    // Allow dev bypass tokens (used on localhost when real Turnstile is not configured)
    if (token === "dev-bypass-token" || token === "dev-mock-token") {
      res.json({ success: true });
      return;
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";

    // Cloudflare test secret always returns success — no network call needed for test keys
    if (secretKey === "1x0000000000000000000000000000000AA") {
      res.json({ success: true });
      return;
    }

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
      }
    );

    const outcome = (await response.json()) as TurnstileVerifyResponse;
    if (outcome.success) {
      res.json({ success: true });
    } else {
      res.status(400).json({
        success: false,
        error: "Turnstile verification failed",
        details: outcome["error-codes"],
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// SERVER INITIALIZATION
// ==========================================

const startServer = async () => {
  await dbConnect();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`Backend Express server is running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start backend server:", err);
});
