import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./contract.d";
import contractJson from "./contract.json" with { type: "json" };

const url =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_PG_STRING
    : process.env.PG_STRING;

if (!url) {
  throw new Error("The connection string is missing!");
}

export const db = postgres<Contract>({
  contractJson,
  url,
});
