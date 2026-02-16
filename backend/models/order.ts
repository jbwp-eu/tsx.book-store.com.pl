import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";

export interface OrderAttributes {
  id: string;
  userId?: string;
  shippingAddress: Record<string, unknown>;
  paymentMethod: string;
  itemsPrice: string | number;
  shippingPrice: string | number;
  taxPrice: string | number;
  totalPrice: string | number;
  isPaid: boolean;
  paidAt?: Date | null;
  isDelivered: boolean;
  deliveredAt?: Date | null;
  paymentResult?: Record<string, unknown> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderCreationAttributes
  extends Optional<
    OrderAttributes,
    | "id"
    | "userId"
    | "paidAt"
    | "deliveredAt"
    | "paymentResult"
    | "createdAt"
    | "updatedAt"
  > {}

export interface OrderInstance
  extends Model<OrderAttributes, OrderCreationAttributes>,
    OrderAttributes {}

const Order = sequelize.define<OrderInstance>(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Users", key: "id" },
    },
    shippingAddress: { type: DataTypes.JSON, allowNull: false },
    paymentMethod: { type: DataTypes.STRING, allowNull: false },
    itemsPrice: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    shippingPrice: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    taxPrice: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    paidAt: {
      type: DataTypes.DATE,
    },
    isDelivered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    deliveredAt: {
      type: DataTypes.DATE,
    },
    paymentResult: { type: DataTypes.JSON, allowNull: true },
  },
  {
    timestamps: true,
  }
);

export default Order;
