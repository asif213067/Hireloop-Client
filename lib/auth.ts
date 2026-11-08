import { betterAuth } from "better-auth"
import { createAuthMiddleware, APIError } from "better-auth/api"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

import { isPasswordValid } from "./password-policy"
import { isPublicSignupRole } from "./roles"

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

  // Role-based accounts: stored on the user, default seeker
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "seeker",
        input: true,
      },
    },
  },

  // Last line of defense: no user is ever created as admin through the app
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const role: unknown = user.role

          if (role !== undefined && !isPublicSignupRole(role)) {
            throw new APIError("BAD_REQUEST", {
              message: "Choose a valid account type.",
            })
          }
        },
      },
    },
  },

  // Server-side password policy: the browser check can be bypassed, this cannot
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Sign up: password policy + role whitelist
      if (ctx.path === "/sign-up/email") {
        const password: unknown = ctx.body?.password

        if (typeof password !== "string" || !isPasswordValid(password)) {
          throw new APIError("BAD_REQUEST", {
            message:
              "Password must be at least 8 characters and include an uppercase letter, a number and a special character.",
          })
        }

        const role: unknown = ctx.body?.role

        if (role !== undefined && !isPublicSignupRole(role)) {
          throw new APIError("BAD_REQUEST", {
            message: "Choose a valid account type.",
          })
        }

        return
      }

      // Profile update: users must never change their own role
      if (ctx.path === "/update-user" && ctx.body?.role !== undefined) {
        throw new APIError("FORBIDDEN", {
          message: "Your account type can't be changed here.",
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
