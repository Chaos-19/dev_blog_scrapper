import { createAuthClient } from "better-auth/react";
import {
  apiKeyClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import type { auth } from "../auth.js";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000",
  plugins: [apiKeyClient()],
  user: {
    plugins: [
      inferAdditionalFields({
        user: {
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
      }),
    ],
  },
});
