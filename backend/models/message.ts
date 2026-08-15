import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";

export interface MessageAttributes {
  id: string;
  email: string;
  text: string;
  clientIp?: string | null;
}

export interface MessageCreationAttributes
  extends Optional<MessageAttributes, "id" | "clientIp"> {}

export interface MessageInstance
  extends Model<MessageAttributes, MessageCreationAttributes>,
    MessageAttributes {}

const Message = sequelize.define<MessageInstance>(
  "Message",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Please enter email" },
        notNull: { msg: "Please enter email" },
        isEmail: { msg: "Invalid email" },
      },
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Please enter text" },
        notNull: { msg: "Please enter text" },
      },
    },
    clientIp: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

export default Message;
