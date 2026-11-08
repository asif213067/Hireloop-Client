import { betterAuth } from "better-auth"
import { createAuthMiddleware, APIError } from "better-auth/api"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

import { isPasswordValid } from "./password-policy"

const client = new MongoClient(`${process.env.MONGODB_CLIENT}`)
const db = client.db(process.env.MONGODB_NAME)

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL as string,
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  // for role based signin or signup
  user: {
    additionalFields: {
      role: {
        type: ["seeker", "recruiter", "admin"],
        input: false,
      },
    },
  },

  // Server-side password policy: the browser check can be bypassed, this cannot
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return

      const password: unknown = ctx.body?.password

      if (typeof password !== "string" || !isPasswordValid(password)) {
        throw new APIError("BAD_REQUEST", {
          message:
            "Password must be at least 8 characters and include an uppercase letter, a number and a special character.",
        })
      }
    }),
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
})
