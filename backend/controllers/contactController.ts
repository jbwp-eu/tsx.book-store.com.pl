import { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
import Message from "../models/message.js";

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { language } = req.query as { language?: string };
  const { email, text } = req.body as { email: string; text: string };

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const domain = process.env.DOMAIN;

  const to_1 = process.env.TO_1;
  const to_2 = process.env.TO_2;

  const from = `"BookStore Customer👻"<tsx@${domain}>`;

  const to = `<${to_1}>,<${to_2}>`;

  try {
    const createdMessage = await Message.create({ email, text });
    if (createdMessage === null) {
      res.status(400);
      throw new Error(
        language === "en"
          ? "Failed to create a new message"
          : "Nie utworzono nowej wiadomości"
      );
    }
    const subject = `Od (email): ${createdMessage.email}`;

    const textMessage = `Wiadomość: ${createdMessage.text}`;

    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      requireTLS: true,
      auth: {
        user: user,
        pass: password,
      },
    });

    const info = await transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      text: textMessage,
    });

    res.status(201).json({
      message: language === "PL" ? "Wiadomość wysłana" : "Message sent",
      info: info.messageId,
    });
  } catch (err) {
    next(err);
  }
};
