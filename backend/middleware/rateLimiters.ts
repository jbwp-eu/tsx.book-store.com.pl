import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";
const trustProxy = Boolean(process.env.TRUST_PROXY?.trim());

function limiter(prodLimit: number) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: isProd ? prodLimit : Math.max(prodLimit, 1000),
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
    validate: { xForwardedForHeader: trustProxy },
    message: { message: "Too many requests, please try again later" },
  });
}

export const loginLimiter = limiter(10);
export const registerLimiter = limiter(5);
export const contactLimiter = limiter(5);
export const paymentLimiter = limiter(20);
