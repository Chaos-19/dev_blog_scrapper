import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { apiKey } from "better-auth/plugins";
import { db } from "./config/db"; // your drizzle instance

export const auth = betterAuth({
  user: {
    additionalFields: {
      topicsOfInterset: {
        type: "string[]",
        required: false,
        input: false,
      },
      readTime: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  plugins: [apiKey()],
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
