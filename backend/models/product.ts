import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";

export interface ProductAttributes {
  id: string;
  title: string;
  description: string;
  images: string[] | Record<string, unknown>;
  banners: string[] | Record<string, unknown>;
  isFeatured: boolean;
  price: string | number;
  category: string;
  countInStock: number;
  rating: string | number;
  numReviews: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCreationAttributes
  extends Optional<
    ProductAttributes,
    "id" | "banners" | "isFeatured" | "category" | "countInStock" | "rating" | "numReviews" | "createdAt" | "updatedAt"
  > {}

export interface ProductInstance
  extends Model<ProductAttributes, ProductCreationAttributes>,
    ProductAttributes {}

const Product = sequelize.define<ProductInstance>(
  "Product",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    images: { type: DataTypes.JSON, allowNull: false },
    banners: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      set(value: unknown) {
        this.setDataValue("isFeatured", value === "true" ? true : false);
      },
    },
    price: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 1,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "books",
    },
    countInStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
      defaultValue: 0,
    },
    numReviews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { timestamps: true }
);

export default Product;
