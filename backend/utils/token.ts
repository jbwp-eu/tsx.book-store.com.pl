import "../loadEnv.js";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "../types/index.js";
import { resolveJwtSecret } from "./jwtSecret.js";

export { resolveJwtSecret };

const JWT_SECRET = resolveJwtSecret(process.env.JWT_SECRET);

export function createJSONToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, {
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
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    const error = new Error(
      language === "en" ? "Not authenticated" : "Brak autoryzacji"
    );
    next(error);
  }
}
