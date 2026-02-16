import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { validateJSONToken } from "../utils/token";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { language } = req.query;
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    if (!req.headers.authorization) {
      res.status(401);
      throw new Error(
        language === "en" ? "Not authenticated" : "Brak autoryzacji"
      );
    }

    const authFragments = req.headers.authorization.split(" ");

    if (authFragments.length !== 2) {
      res.status(401);
      throw new Error(
        language === "en" ? "Not authenticated" : "Brak autoryzacji"
      );
    }

    const authToken = authFragments[1];

    const validatedToken = validateJSONToken(authToken, req, res, next);

    if (!validatedToken) {
      return; // validateJSONToken already called next() with error
    }

    const user = await User.findOne({
      where: {
        id: validatedToken.userId,
      },
      attributes: { exclude: ["password"] },
    });
    req.user = user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        }
      : null;

    if (!req.user) {
      res.status(401);
      throw new Error(
        language === "en" ? "No authorization" : "Brak autoryzacji"
      );
    }
  } catch (err) {
    next(err);
    return;
  }

  next();
};

export const admin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { language } = req.query;
  try {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401);
      throw new Error(
        language === "en"
          ? "No authorization as admin"
          : "Brak autoryzacji jako admin"
      );
    }
  } catch (err) {
    next(err);
  }
};
