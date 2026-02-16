import "colors";
import Product, { ProductCreationAttributes } from "./models/product";
import products from "./products";
import User, { UserCreationAttributes } from "./models/user";
import users from "./users";
import Order from "./models/order";
import OrderItem from "./models/orderItem";
import Message from "./models/message";

const importData = async (): Promise<void> => {
  try {
    await Product.bulkCreate(products as unknown as ProductCreationAttributes[], { validate: true });
    console.log("Product data imported".blue.inverse);
    await User.bulkCreate(users as unknown as UserCreationAttributes[], { validate: true });
    console.log("User data imported".blue.inverse);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  importData();
}

const destroyData = async (): Promise<void> => {
  try {
    await Product.destroy({ where: {} });
    console.log("Product data destroyed".red.inverse);
    await User.destroy({ where: {} });
    console.log("User data destroyed".red.inverse);
    await Order.destroy({ where: {} });
    await OrderItem.destroy({ where: {} });
    console.log("Order & OrderItem data destroyed".red.inverse);
    await Message.destroy({ where: {} });
    console.log("Message data destroyed".red.inverse);
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
}
