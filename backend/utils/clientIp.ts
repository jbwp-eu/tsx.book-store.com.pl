import type { Request } from "express";

/** Client address from Express (`req.ip` after `trust proxy`). */
export function clientIp(req: Request): string | null {
  const ip = req.ip?.trim();
  return ip || null;
}
