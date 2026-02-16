import { Request, Response, NextFunction } from "express";
import Product from "../models/product";
import { calcPrices } from "../utils/calcPrices";
import Order from "../models/order";
import OrderItem from "../models/orderItem";
import sequelize from "../config/db";
import User from "../models/user";
import type { ShippingAddress } from "../types";

interface OrderItemFromClient {
  id: string;
  title: string;
  images: string[] | Record<string, unknown>;
  quantity: number;
  price?: number;
}

interface AddOrderBody {
  orderItems: OrderItemFromClient[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export const addOrderItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { language } = req.query as { language?: string };
  const { orderItems, shippingAddress, paymentMethod } = req.body as AddOrderBody;

  const t = await sequelize.transaction();
  try {
    if (orderItems.length === 0) {
      res.status(400);
      throw new Error(
        language === "en" ? "No order items" : "Brak pozycji w zamówieniu"
      );
    }

    const itemsFromDB = await Product.findAll({
      where: {
        id: orderItems.map((x) => x.id),
      },
    });
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB.id === itemFromClient.id
      );

      if (!matchingItemFromDB) {
        res.status(401);
        throw new Error(
          language === "en"
            ? "Failed to verify payment"
            : "Nie udało się zweryfikować płatności"
        );
      }
      const price = Number(matchingItemFromDB.price);
      return {
        ...itemFromClient,
        product: itemFromClient.id,
        price,
        id: undefined,
      };
    });

    const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
      calcPrices(dbOrderItems.map((item) => ({ price: item.price, quantity: item.quantity })));

    const newOrder = {
      userId: req.user!.id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      OrderItems: dbOrderItems,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createdOrder = await Order.create(newOrder as any, {
      include: [OrderItem],
      transaction: t,
    });

    const createdOrderJson = createdOrder.toJSON() as unknown as {
      OrderItems: Array< { product: string; quantity: number; title: string } >;
    };
    for (const item of createdOrderJson.OrderItems) {
      const product = await Product.findByPk(item.product);

      if (!product) {
        throw new Error(
          language === "en" ? "Product not found" : "Produkt nie znaleziony"
        );
      }
      if (product.countInStock - item.quantity < 0) {
        throw new Error(
          language === "en"
            ? `The quantity of ordered items "${item.title}" is greater than stock`
            : `Ilość zamówionych pozycji: "${item.title}" jest większa niż stan magazynowy`
        );
      }

      await product.decrement("countInStock", {
        by: item.quantity,
        transaction: t,
      });
    }

    await t.commit();

    res.status(201).json({
      createdOrder,
      message: language === "en" ? "Order created" : "Zamówienie utworzone",
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
  const { language } = req.query as { language?: string };

  try {
    const order = await Order.findByPk(id, { include: OrderItem });

    if (order === null) {
      res.status(404);
      throw new Error(
        language === "en" ? "Order not found" : "Nie znaleziono zamówienia"
      );
    } else {
      res.status(201).json(order);
    }
  } catch (err) {
    next(err);
  }
};

export const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { language } = req.query as { language?: string };

  try {
    const orders = await Order.findAll({
      where: { userId: req.user!.id },
      order: [["createdAt", "DESC"]],
    });
    if (orders.length === 0) {
      res.status(404);
      throw new Error(
        language === "en" ? "Orders not found" : "Nie znaleziono zamówień"
      );
    } else {
      res.status(201).json(orders);
    }
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const pageSize = Number(process.env.PAGINATION_LIMIT);
  const { language, pageNumber } = req.query as { language?: string; pageNumber?: string };

  let page: number;
  if (!pageNumber || pageNumber === "undefined") {
    page = 1;
  } else {
    page = Number(pageNumber);
  }

  try {
    const { count, rows } = await Order.findAndCountAll({
      include: [{ model: User }],
      limit: pageSize,
      offset: pageSize * (page - 1),
      order: [["createdAt", "DESC"]],
    });

    if (rows.length === 0) {
      res.status(404);
      throw new Error(
        language === "en" ? "Orders not found" : "Nie znaleziono zamówień"
      );
    } else {
      res
        .status(200)
        .json({ orders: rows, pages: Math.ceil(count / pageSize) });
    }
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { language } = req.query as { language?: string };
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id[0];

  try {
    const order = await Order.findByPk(id);
    if (order === null) {
      res.status(404);
      throw new Error(
        language === "en" ? "Order not found" : "Nie znaleziono zamówienia"
      );
    } else {
      await order.destroy();
      res.json({
        message:
          language === "en" ? "Order deleted" : "Zamówienie zostało usunięte",
      });
    }
  } catch (err) {
    next(err);
  }
};

export const updateOrderToDelivered = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { language } = req.query as { language?: string };
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id[0];

  try {
    const order = await Order.findByPk(id);
    if (order === null) {
      res.status(404);
      throw new Error(
        language === "en" ? "Order not found" : "Nie znaleziono zamówienia"
      );
    } else {
      order.set({
        isDelivered: true,
        deliveredAt: new Date(),
      });
      await order.save();

      res.json({
        message:
          language === "en"
            ? "Order updated as delivered"
            : "Zamówienie zostało oznaczone jako dostarczone",
      });
    }
  } catch (err) {
    next(err);
  }
};
