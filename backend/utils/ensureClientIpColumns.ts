import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Message from "../models/message.js";
import Order from "../models/order.js";

const CLIENT_IP_COLUMN = {
  type: DataTypes.STRING(45),
  allowNull: true,
};

function tableName(model: typeof Message | typeof Order): string {
  const name = model.getTableName();
  return typeof name === "string" ? name : name.tableName;
}

/** `sequelize.sync()` does not add columns to existing tables. */
export async function ensureClientIpColumns(): Promise<void> {
  const qi = sequelize.getQueryInterface();
  for (const model of [Message, Order] as const) {
    const table = tableName(model);
    const desc = await qi.describeTable(table);
    if (!desc.clientIp) {
      await qi.addColumn(table, "clientIp", CLIENT_IP_COLUMN);
      console.log(`[db] added ${table}.clientIp`);
    }
  }
}
