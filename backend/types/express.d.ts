declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        isAdmin: boolean;
        [key: string]: unknown;
      } | null;
    }
  }
}

export {};
