import nodemailer from "nodemailer";
import { Response, NextFunction } from "express";
import Order from "../models/order";
import User from "../models/user";
import type { OrderInstance } from "../types";
import type { UserInstance } from "../types";

type OrderWithUser = OrderInstance & { User: UserInstance };

export const sendPurchaseReceipt = async (
  updatedOrderId: string,
  language: string,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedOrder = (await Order.findByPk(updatedOrderId, {
      include: [User],
    })) as OrderWithUser | null;

    const date = new Date().toLocaleString();

    const ln = String(language);

    if (!updatedOrder) {
      res.status(404).json({
        message: ln === "pl" ? "Nie znaleziono zamówienia" : "Order not found",
      });
      return;
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 465;
    const smtpUser = process.env.SMTP_USER;
    const password = process.env.SMTP_PASSWORD;
    const domain = process.env.DOMAIN;

    const to_1 = updatedOrder.User.email;
    const to_3 = process.env.TO_3;

    const transporter = nodemailer.createTransport({
      host,
      port,
      requireTLS: true,
      auth: {
        user: smtpUser,
        pass: password,
      },
    });

    const from = `"BookStore" <tsx@${domain}>`;

    const to = `<${to_1}>,<${to_3}>`;

    const subject =
      ln === "pl" ? "Potwierdzenie zamówienia" : "Order confirmation";

    const { id, totalPrice, itemsPrice, shippingPrice } = updatedOrder;

    const shippingPriceNum =
      typeof shippingPrice === "string" ? parseFloat(shippingPrice) : shippingPrice;

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html: `<head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Purchase Receipt</title>
                <style>
                  h2 {
                    color: gray;
                  }
                  section {
                    padding: 5px;
                  }
                  table {
                    width: 90%;
                    }
                  th {
                    font-weight: 400;
                    text-align: left;
                    color: grey;
                  }
                  td {
                    font-weight: 300;
                    color: grey;
                    text-align: right;
                  }
                  tr {
                    justify-content: space-between;
                  }
                  #totalPrice {
                    font-weight: 700;
                  }
                </style>
            </head>
            <body>
              <section>
                <h2>${
                  ln === "pl" ? "Potwierdzenie zamówienia" : "Purchase Receipt"
                }</h2>
                <table>
                  <tr>
                    <th>${ln === "pl" ? "Nr zamówienia" : "Order ID:"}</th>
                    <td>...${id.substring(id.length - 6)};</td>
                  </tr>
                  <tr>
                    <th>${
                      ln === "pl" ? "Data zamówienia" : "Purchase Date:"
                    }</th>
                    <td>${date};</td>
                  </tr>
                  <tr>
                    <th>${ln === "pl" ? "Pozycje" : "Items:"}</th>
                    <td>${itemsPrice}; PLN</td>
                  </tr>
                  <tr>
                    <th>${ln === "pl" ? "Dostawa" : "Shipping:"}</th>
                    <td>${shippingPriceNum.toFixed(2)}; PLN</td>
                  </tr>
                  <tr>
                    <th>${ln === "pl" ? "Zapłacono" : "Paid:"}</th>
                    <td id="totalPrice">${totalPrice}; PLN</td>
                  </tr>
                </table>
              </section>
            </body>`,
    });

    console.log("Sent message id: %s", info.messageId);

    res.status(201).json({
      message: language === "pl" ? "Płatność wykonana" : "Payment successful",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.log(message);
    next(err);
  }
};
