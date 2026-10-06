import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_PG_STRING
    : process.env.PG_STRING;

if (!connectionString) {
  throw new Error("The connection string is missing!");
}

const adapter = new PrismaPg({
  connectionString,
});

export const prisma = new PrismaClient({
  adapter,
});

export const pool = new Pool({
  connectionString,
});
