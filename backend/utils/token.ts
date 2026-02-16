import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "../types";

export function createJSONToken(userId: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return jwt.sign({ userId }, secret, {
    expiresIn: "1h",
  });
}

export function validateJSONToken(
  token: string,
  req: Request,
  _res: Response,
  next: NextFunction
): JwtPayload | void {
  const { language } = req.query;
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    next(new Error("JWT_SECRET is not defined"));
    return;
  }
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    const error = new Error(
      language === "en" ? "Not authenticated" : "Brak autoryzacji"
    );
    next(error);
  }
}
