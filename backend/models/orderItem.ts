import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

export interface OrderItemAttributes {
  id: string;
  orderId?: string;
  title: string;
  images: string[] | Record<string, unknown>;
  quantity: number;
  product: string;
  price: string | number;
}

export interface OrderItemCreationAttributes
  extends Optional<OrderItemAttributes, "id" | "orderId"> {}

export interface OrderItemInstance
  extends Model<OrderItemAttributes, OrderItemCreationAttributes>,
    OrderItemAttributes {}

const OrderItem = sequelize.define<OrderItemInstance>(
  "OrderItem",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Orders", key: "id" },
    },
    title: { type: DataTypes.STRING, allowNull: false },
    images: { type: DataTypes.JSON, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    product: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
  },
  {
    timestamps: false,
  }
);

export default OrderItem;
