import { Request, Response, NextFunction } from "express";
import fs from "fs";
import { Op } from "sequelize";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import Product from "../models/product";
import ProductReview from "../models/productReview";
import type { ProductInstance } from "../models/product";
import type { ProductReviewInstance } from "../models/productReview";
import { uploadFile, deleteFile } from "../config/aws-s3";

type ProductWithReviews = ProductInstance & {
  ProductReviews: ProductReviewInstance[];
};

function asStringArray(value: string[] | Record<string, unknown>): string[] {
  return Array.isArray(value) ? value : [];
}

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { language } = req.query as { language?: string };
  const pageSize = Number(process.env.PAGINATION_LIMIT);
  try {
    const newProduct = {
      images: ["test", "test_2"],
      banners: ["test_3"],
      title: "Test",
      description: "Sample description",
      isFeatured: true,
      price: 1,
    };
    const product = await Product.create(newProduct);
    if (product === null) {
      res.status(400);
      throw new Error(
        language === "en"
          ? "Failed to create a new product"
          : "Nie utworzono nowego produktu"
      );
    }
    const count = await Product.count();
    res.status(201).json({
      message:
        language === "en"
          ? "Sample product created"
          : "Utworzono przykładowy product",

      pages: Math.ceil(count / pageSize),
    });
  } catch (err) {
    next(err);
  }
};

export const createProductReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { language } = req.query as { language?: string };
  const { id } = req.params;
  const { title, description, rate } = req.body as {
    title: string;
    description: string;
    rate: number;
  };

  try {
    const product = await Product.findOne({
      where: { id },
      include: ProductReview,
    });

    if (product === null) {
      res.status(404);
      throw new Error(
        language === "en"
          ? "Product not found"
          : "Nie udało się znaleźć produktu"
      );
    }

    const productWithReviews = product as unknown as ProductWithReviews;
    const alreadyReviewed = productWithReviews.ProductReviews.find(
      (review) => review.userId === req.user!.id
    );

    if (alreadyReviewed) {
      res.status(400);
      return next(
        new Error(
          language === "en"
            ? "Product already reviewed"
            : "product już zaopiniowany"
        ) as unknown as Parameters<NextFunction>[0]
      );
    }

    const review = {
      title,
      description,
      rate: Number(rate),
      userName: req.user!.name,
      userId: req.user!.id,
      productId: product.id,
    };

    await ProductReview.create(review);

    await product.reload({ include: [ProductReview] });

    const reloaded = product as unknown as ProductWithReviews;
    reloaded.numReviews = reloaded.ProductReviews.length;
    reloaded.rating =
      reloaded.ProductReviews.reduce((acc, r) => acc + r.rate, 0) /
      reloaded.ProductReviews.length;

    await product.save();

    res.status(201).json({
      message: language === "en" ? "Review created" : "Recenzja utworzona",
    });
  } catch (err) {
    next(err);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    pageNumber,
    language,
    rating,
    price,
    order,
    category,
    search,
  } = req.query as {
    pageNumber?: string;
    language?: string;
    rating?: string;
    price?: string;
    order?: string;
    category?: string;
    search?: string;
  };

  const pageSize = Number(process.env.PAGINATION_LIMIT);

  let page: number;
  if (!Number(pageNumber) || pageNumber === "undefined") {
    page = 1;
  } else {
    page = Number(pageNumber);
  }

  const ratingFilter =
    rating && rating !== "any"
      ? {
          rating: {
            [Op.gte]: Number(rating),
          },
        }
      : {};

  const priceFilter =
    price && price !== "any"
      ? {
          price: {
            [Op.gte]: Number(price.split("-")[0]),
            [Op.lt]: Number(price.split("-")[1]),
          },
        }
      : {};

  const searchFilter = search
    ? {
        title: {
          [Op.substring]: search,
        },
      }
    : {};

  try {
    const { count, rows } = await Product.findAndCountAll({
      limit: pageSize,
      offset: pageSize * (page - 1),
      where: { ...ratingFilter, ...priceFilter, ...searchFilter },
      order: [
        order === "ascending"
          ? category === "rating"
            ? (["rating", "ASC"] as const)
            : category === "price"
            ? (["price", "ASC"] as const)
            : (["title", "ASC"] as const)
          : order === "descending"
          ? category === "rating"
            ? (["rating", "DESC"] as const)
            : category === "price"
            ? (["price", "DESC"] as const)
            : (["title", "DESC"] as const)
          : (["createdAt", "ASC"] as const),
      ],
    });

    if (rows.length === 0) {
      res.status(404);
      throw new Error(
        language === "en" ? "Products not found" : "Brak produktów"
      );
    }

    const cloudFrontKeyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID;
    const cloudFrontPrivateKey = process.env.CLOUDFRONT_PRIVATE_KEY;

    for (const row of rows) {
      const images = asStringArray(row.images);
      if (images.length !== 0) {
        for (let i = 0; i < images.length; i++) {
          if (images[i].slice(0, 3) === "aws" && cloudFrontKeyPairId && cloudFrontPrivateKey) {
            (row.images as string[])[i] = getSignedUrl({
              url: "https://d8gge2z531r61.cloudfront.net/" + images[i],
              keyPairId: cloudFrontKeyPairId,
              dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
              privateKey: cloudFrontPrivateKey,
            });
          }
        }
      }
    }

    setTimeout(() => {
      res
        .status(200)
        .json({ products: rows, pages: Math.ceil(count / pageSize) });
    }, 0);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
  const { language } = req.query as { language?: string };

  try {
    const product = await Product.findOne({
      where: { id },
      include: ProductReview,
    });

    if (product === null) {
      res.status(404);
      throw new Error(
        language === "en"
          ? "Product not found"
          : "Nie udało się znaleźć produktu"
      );
    }

    const cloudFrontKeyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID;
    const cloudFrontPrivateKey = process.env.CLOUDFRONT_PRIVATE_KEY;
    const images = asStringArray(product.images);
    if (images.length !== 0 && cloudFrontKeyPairId && cloudFrontPrivateKey) {
      for (let i = 0; i < images.length; i++) {
        if (images[i].slice(0, 3) === "aws") {
          (product.images as string[])[i] = getSignedUrl({
            url: "https://d8gge2z531r61.cloudfront.net/" + images[i],
            keyPairId: cloudFrontKeyPairId,
            dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            privateKey: cloudFrontPrivateKey,
          });
        }
      }
    }

    setTimeout(() => {
      res.status(200).json(product);
    }, 0);
  } catch (err) {
    next(err);
  }
};

export const getFeaturedProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { language } = req.query as { language?: string };
  try {
    const products = await Product.findAll({
      where: { isFeatured: true },
    });
    if (products.length === 0) {
      res.status(404);
      throw new Error(
        language === "en"
          ? "Featured products not found"
          : "Nie udało się znaleźć polecanych produktów"
      );
    }

    const cloudFrontKeyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID;
    const cloudFrontPrivateKey = process.env.CLOUDFRONT_PRIVATE_KEY;
    for (const product of products) {
      const banners = asStringArray(product.banners);
      if (banners.length !== 0 && banners[0].slice(0, 3) === "aws" && cloudFrontKeyPairId && cloudFrontPrivateKey) {
        (product.banners as string[])[0] = getSignedUrl({
          url: "https://d8gge2z531r61.cloudfront.net/" + banners[0],
          keyPairId: cloudFrontKeyPairId,
          dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          privateKey: cloudFrontPrivateKey,
        });
      }
    }

    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
  const { language } = req.query as { language?: string };
  const {
    title,
    description,
    price,
    category,
    countInStock,
    isFeatured,
  } = req.body as {
    title?: string;
    description?: string;
    price?: number;
    category?: string;
    countInStock?: number;
    isFeatured?: boolean;
  };

  const pageSize = Number(process.env.PAGINATION_LIMIT);

  try {
    const product = await Product.findByPk(id);

    if (product === null) {
      res.status(404);
      throw new Error(
        language === "en"
          ? "Product not found"
          : "Nie udało się znaleźć produktu"
      );
    }

    const productImages = asStringArray(product.images);
    const productBanners = asStringArray(product.banners);

    const files = req.files as { images?: Express.Multer.File[]; banners?: Express.Multer.File[] } | undefined;

    if (files?.images) {
      for (const image of productImages) {
        if (image.slice(0, 7) === "uploads") {
          fs.unlink(`uploads/${image.slice(8)}`, (err) => {
            if (err) {
              console.log(
                `An image ${product.title} did not exist in an uploads directory`
              );
            }
          });
        }
      }
    }

    if (files?.banners) {
      for (const image of productBanners) {
        if (image.slice(0, 7) === "uploads") {
          fs.unlink(`uploads/${image.slice(8)}`, (err) => {
            if (err) {
              console.log(
                `A banner ${product.title} did not exist in an uploads directory`
              );
            }
          });
        }
      }
    }

    let images: string[] | undefined;
    if (files?.images && files.images.length !== 0) {
      try {
        for (let i = 0; i < productImages.length; i++) {
          if (productImages[i].startsWith("aws")) {
            await deleteFile(productImages[i]);
          }
        }
        images =
          (await Promise.all(files.images.map((file) => uploadFile(file)))) ||
          product.images as string[];
      } catch (err) {
        console.log(err);
      }
    }

    let banners: string[] | undefined;
    if (files?.banners && files.banners.length !== 0) {
      try {
        if (productBanners[0]?.slice(0, 3) === "aws") {
          await deleteFile(productBanners[0]);
        }
        banners =
          (await Promise.all(
            files.banners.map(async (file) => await uploadFile(file))
          )) || (product.banners as string[]);
      } catch (err) {
        console.log(err);
      }
    }

    product.set({
      title: title ?? product.title,
      category: category ?? product.category,
      countInStock: countInStock ?? product.countInStock,
      price: price ?? product.price,
      description: description ?? product.description,
      images: images ?? product.images,
      banners: banners ?? product.banners,
      isFeatured: isFeatured ?? product.isFeatured,
    });

    await product.save();

    const count = await Product.count();

    res.status(201).json({
      message:
        language === "en" ? "Product updated" : "Produkt został zaktualizowany",
      page: Math.ceil(count / pageSize),
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { language } = req.query as { language?: string };
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
  const pageSize = Number(process.env.PAGINATION_LIMIT);

  try {
    const product = await Product.findByPk(id);
    if (product === null) {
      res.status(404);
      throw new Error(
        language === "en" ? "Product not found" : "Nie znaleziono produktu"
      );
    }

    const productImages = asStringArray(product.images);
    const productBanners = asStringArray(product.banners);

    if (productImages.length !== 0) {
      for (let i = 0; i < productImages.length; i++) {
        if (productImages[i].slice(0, 7) === "uploads") {
          fs.unlink(`uploads/${productImages[i].slice(8)}`, (err) => {
            if (err) {
              console.log(
                `An image ${product.title} did not exist in an uploads directory`
              );
            }
          });
        } else if (productImages[i].slice(0, 3) === "aws") {
          await deleteFile(productImages[i]);
        }
      }
    }

    if (productBanners.length !== 0) {
      if (productBanners[0].slice(0, 7) === "uploads") {
        fs.unlink(`uploads/${productBanners[0].slice(8)}`, (err) => {
          if (err) {
            console.log(
              `An image ${product.title} did not exist in an uploads directory`
            );
          }
        });
      } else if (productBanners[0].slice(0, 3) === "aws") {
        await deleteFile(productBanners[0]);
      }
    }

    await product.destroy();

    const count = await Product.count();
    res.json({
      message:
        language === "en" ? "Product deleted" : "Produkt został usunięty",
      pages: Math.ceil(count / pageSize),
    });
  } catch (err) {
    next(err);
  }
};
