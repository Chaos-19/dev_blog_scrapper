import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { apiKey } from "better-auth/plugins";
import { db } from "./config/db.js"; // your drizzle instance

import * as schema from "./schema/schema.js";

export const auth = betterAuth({
  user: {
    additionalFields: {
      topicsOfInterset: {
        type: "string[]",
        required: true,
        //input: false,
      },
      readTime: {
        type: "string",
        required: true,
        //input: false,
      },
    },
  },
  plugins: [
    apiKey({
      enableMetadata: true,
    }),
  ],
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
});
