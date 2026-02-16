import path from "path";
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import overviewRoutes from "./routes/overviewRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";
import sequelize from "./config/db.js";
import Stripe from "stripe";
import Product from "./models/product.js";
import User from "./models/user.js";
import ProductReview from "./models/productReview.js";
import Order from "./models/order.js";
import OrderItem from "./models/orderItem.js";
import Message from "./models/message.js";

ProductReview.belongsTo(Product);
ProductReview.belongsTo(User);
Order.belongsTo(User);
OrderItem.belongsTo(Order);

Product.hasMany(ProductReview, { onDelete: "CASCADE", hooks: true });
User.hasMany(ProductReview);
User.hasMany(Order);
Order.hasMany(OrderItem, { onDelete: "CASCADE", hooks: true });

void Message; // ensure model is registered for sequelize.sync()

const port = process.env.PORT;

const app = express();

app.use("/api/webhooks", stripeRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/overview", overviewRoutes);
app.use("/api/contact", contactRoutes);

app.use("/uploads", express.static("uploads"));

app.post("/api/create-payment-intent", async (req: Request, res: Response, next: NextFunction) => {
  const { id, amount, currency } = req.body;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST_MODE as string);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { orderId: id },
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

const projectRoot = path.resolve(process.cwd());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(projectRoot, "frontend/dist")));

  app.get("/(.*)", (_req: Request, res: Response) => {
    res.sendFile(path.resolve(projectRoot, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (_req: Request, res: Response) => {
    res.send("API is running ...");
  });
}

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Could not find this route = ${req.originalUrl}`) as Error & { statusCode?: number };
  res.status(404);
  error.statusCode = 404;
  next(error);
});

app.use((err: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
  console.log("err:", err);
  const statusCode = err.statusCode ?? (res.statusCode !== 200 ? res.statusCode : 500) ?? 500;
  const message = err.message || "An unknown error occurred !";
  res.status(statusCode).json({ message });
});

app.listen(port, () => {
  console.log(`Server is listening on port:${port}`);
});

(async () => {
  try {
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.log(error);
  }
})();
