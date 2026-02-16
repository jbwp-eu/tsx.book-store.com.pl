import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcryptjs";

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

const User = sequelize.define<UserInstance>(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Please enter name" },
        notNull: { msg: "Please enter name" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Please enter email" },
        notNull: { msg: "Please enter email" },
        isEmail: { msg: "Invalid email address" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Please enter a password" },
        notNull: { msg: "Please enter a password" },
        len: { args: [4, 255], msg: "Minimum password length is 4 characters" },
      },
      set(value: string) {
        this.setDataValue("password", bcrypt.hashSync(value, 10));
      },
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    modelName: "User",
    timestamps: true,
  }
);

(User as typeof User & { matchPassword: (a: string, b: string) => Promise<boolean> }).matchPassword =
  async function (
    enteredPassword: string,
    userPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, userPassword);
  };

export default User;
