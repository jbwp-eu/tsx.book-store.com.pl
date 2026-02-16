import dotenv from "dotenv";

dotenv.config();

const { ADMIN_PASSWORD } = process.env;

export interface SeedUser {
  name: string;
  email: string;
  password: string | undefined;
  isAdmin: boolean;
}

const USERS: SeedUser[] = [
  {
    name: "admin",
    email: "admin@test.pl",
    password: ADMIN_PASSWORD,
    isAdmin: true,
  },
];

export default USERS;
