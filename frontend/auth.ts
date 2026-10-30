import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
  //...other options
  emailAndPassword: {
    enabled: true,
  },
  database: new Database("./sqlite.db"),
});
