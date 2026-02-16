import { Request, Response, NextFunction } from "express";
import sequelize from "../config/db.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import ProductReview from "../models/productReview.js";
import User from "../models/user.js";

export const getOverviewData = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productsCount = await Product.count();
    const usersCount = await User.count();
    const ordersCount = await Order.count();
    const reviewsCount = await ProductReview.count();

    const totalSales = await Order.sum("totalPrice");

    const orders = await Order.findAll({
      attributes: ["totalPrice", "createdAt", "id"],
      include: [{ model: User }],
      limit: 3,
      order: [["createdAt", "DESC"]],
    });

    const salesData = await Order.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "Date"],
        [sequelize.fn("SUM", sequelize.col("totalPrice")), "Total"],
      ],
      group: [sequelize.fn("DATE", sequelize.col("createdAt")), "Date"],
      order: [["Date", "ASC"]],
    });

    res.status(200).json({
      productsCount,
      usersCount,
      ordersCount,
      reviewsCount,
      totalSales,
      orders,
      salesData,
    });
  } catch (err) {
    next(err);
  }
};
