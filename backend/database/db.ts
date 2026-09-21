import { Pool } from "pg";

const connectionString = process.env.PG_STRING;

if (!connectionString) {
  throw new Error("The connection string is missing!");
}

export const pool = new Pool({
  connectionString,
});
