import { Request, Response, NextFunction } from "express";
import sequelize from "../config/db";
import Product from "../models/product";
import ProductReview from "../models/productReview";
import type { ProductReviewInstance } from "../models/productReview";
import type { ProductInstance } from "../models/product";
import User from "../models/user";

type ProductReviewWithProduct = ProductReviewInstance & { Product: ProductInstance };
type ProductWithReviews = ProductInstance & {
  ProductReviews: ProductReviewInstance[];
};

export const getReviews = async (
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
    const { count, rows } = await ProductReview.findAndCountAll({
      limit: pageSize,
      offset: pageSize * (page - 1),
      include: [{ model: Product }, { model: User }],
    });
    if (rows.length === 0) {
      res.status(404);
      throw new Error(
        language === "en" ? "There are no reviews" : "Nie ma żadnych opinii"
      );
    } else {
      res
        .status(200)
        .json({ reviews: rows, pages: Math.ceil(count / pageSize) });
    }
  } catch (err) {
    next(err);
  }
};

export const getMyReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { language } = req.query as { language?: string };
  try {
    const reviews = await ProductReview.findAll({
      where: { userId: req.user!.id },
      include: Product,
    });
    if (reviews.length === 0) {
      res.status(404);
      throw new Error(
        language === "en" ? "There are no reviews" : "Nie ma żadnych opinii"
      );
    } else {
      res.status(200).json(reviews);
    }
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { language } = req.query as { language?: string };
  const { id } = req.params;
  const t = await sequelize.transaction();
  try {
    const review = await ProductReview.findOne({
      where: { id },
      include: Product,
    });

    if (review === null) {
      res.status(404);
      throw new Error(
        language === "en" ? "Review not found" : "Nie znaleziono opinii"
      );
    }

    const reviewWithProduct = review as unknown as ProductReviewWithProduct;
    const productId = reviewWithProduct.Product.id;

    const product = await Product.findOne({
      where: { id: productId },
      include: ProductReview,
    });

    if (!product) {
      res.status(404);
      throw new Error(
        language === "en" ? "Product not found" : "Nie znaleziono produktu"
      );
    }

    await review.destroy({ transaction: t });

    await product.reload({ include: [ProductReview], transaction: t });

    const productWithReviews = product as unknown as ProductWithReviews;
    productWithReviews.numReviews = productWithReviews.ProductReviews.length;
    productWithReviews.rating =
      productWithReviews.ProductReviews.reduce((acc, r) => acc + r.rate, 0) /
      productWithReviews.ProductReviews.length;

    await product.save({ transaction: t });

    await t.commit();

    res.json({
      message: language === "en" ? "Review deleted" : "Opinia została usunięta",
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
