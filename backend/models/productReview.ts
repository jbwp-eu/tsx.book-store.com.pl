import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";

export interface ProductReviewAttributes {
  id: string;
  productId?: string;
  userId?: string;
  title: string;
  description: string;
  rate: number;
  userName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductReviewCreationAttributes
  extends Optional<
    ProductReviewAttributes,
    "id" | "productId" | "userId" | "createdAt" | "updatedAt"
  > {}

export interface ProductReviewInstance
  extends Model<ProductReviewAttributes, ProductReviewCreationAttributes>,
    ProductReviewAttributes {}

const ProductReview = sequelize.define<ProductReviewInstance>(
  "ProductReview",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Products", key: "id" },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Users", key: "id" },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default ProductReview;
