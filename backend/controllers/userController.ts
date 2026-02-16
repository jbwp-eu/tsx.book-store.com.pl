import { Request, Response, NextFunction } from "express";
import Order from "../models/order.js";
import ProductReview from "../models/productReview.js";
import User from "../models/user.js";
import { createJSONToken } from "../utils/token.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { language } = req.query as { language?: string };
  const { name, email, password } = req.body as { name: string; email: string; password: string };

  try {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      res.status(400);
      throw new Error(
        language === "en"
          ? "The user with the provided email address already exists"
          : "Użytkownik o podanym, adresie email już istnieje"
      );
    }

    const user = await User.create(
      {
        name,
        email,
        password,
        isAdmin: false,
      },
      { fields: ["name", "email", "password"] }
    );

    const token = createJSONToken(user.id);

    res.status(201).json({
      message:
        language === "en"
          ? "User registered"
          : "Użytkownik został zarejestrowany",
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  const { language } = req.query as { language?: string };

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401);
      throw new Error(
        language === "en"
          ? "Invalid email or password !"
          : "Nieprawidłowy adres e-mail lub hasło"
      );
    }

    const UserModel = User as typeof User & {
      matchPassword: (a: string, b: string) => Promise<boolean>;
    };
    if (user && (await UserModel.matchPassword(password, user.password))) {
      const token = createJSONToken(user.id);

      res.status(200).json({
        message:
          language === "en" ? "You are logged in !" : "Jesteś zalogowany !",
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
      });
    } else {
      res.status(401);
      throw new Error(
        language === "en"
          ? "Invalid email or password !"
          : "Nieprawidłowy adres e-mail lub hasło"
      );
    }
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { language } = req.query as { language?: string };
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password"],
      },
      include: [{ model: ProductReview }, { model: Order }],
    });
    if (users.length === 0) {
      res.status(404);
      throw new Error(
        language === "en" ? "Users not found" : "Brak użytkowników"
      );
    } else {
      res.status(200).json(users);
    }
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
  const { language } = req.query as { language?: string };
  try {
    const user = await User.findByPk(id);
    if (user === null) {
      res.status(404);
      throw new Error(
        language === "en" ? "User not found" : "Nie znalezionp użytkownika"
      );
    } else {
      if (user.isAdmin) {
        throw new Error(
          language === "en"
            ? "Cannot delete admin user"
            : "Nie można usunąć administratora"
        );
      } else {
        await user.destroy();
        res.json({
          message: language === "en" ? "User deleted" : "Użytkownik usunięty",
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
  const { language } = req.query as { language?: string };

  try {
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password", "id"] },
    });
    if (user === null) {
      res.status(404);
      throw new Error(language === "en" ? "No user" : "Brak użytkownika");
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
  const { language } = req.query as { language?: string };
  const { email, name, isAdmin } = req.body as {
    email?: string;
    name?: string;
    isAdmin?: boolean;
  };

  try {
    const user = await User.findByPk(id);
    if (user === null) {
      res.status(404);
      throw new Error(
        language === "en" ? "User not found" : "Nie znaleziono użytkownika"
      );
    } else {
      user.set({
        email: email ?? user.email,
        name: name ?? user.name,
        isAdmin: isAdmin,
      });
      await user.save();
      res.status(200).json({
        message:
          language === "en"
            ? "User data has been updated"
            : "Dane użytkownika zostały zaktualizowane",
      });
    }
  } catch (err) {
    next(err);
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { language } = req.query as { language?: string };
  const { email, name, password } = req.body as {
    email?: string;
    name?: string;
    password?: string;
  };

  try {
    const user = await User.findByPk(req.user!.id);

    if (!user) {
      res.status(404);
      throw new Error(
        language === "en" ? "User not found" : "Nie znaleziono użytkownika"
      );
    }

    user.set({
      email: email ?? user.email,
      name: name ?? user.name,
    });

    if (password) {
      (user as { password: string }).password = password;
    }

    await user.save();

    res.status(201).json({
      message:
        language === "en"
          ? "User profile has been updated"
          : "Profil użytkownika został zaktualizowany",
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    next(err);
  }
};
