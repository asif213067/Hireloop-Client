import { betterAuth } from "better-auth"
import { createAuthMiddleware, APIError } from "better-auth/api"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { jwt } from "better-auth/plugins/jwt"

import { isPasswordValid } from "./password-policy"
import { isPublicSignupRole } from "./roles"

const client = new MongoClient(`${process.env.MONGODB_CLIENT}`)
export const db = client.db(process.env.MONGODB_NAME)

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL as string,
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  plugins: [jwt()],

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

      // Password change: same policy as sign-up
      if (ctx.path === "/change-password") {
        const newPassword: unknown = ctx.body?.newPassword

        if (typeof newPassword !== "string" || !isPasswordValid(newPassword)) {
          throw new APIError("BAD_REQUEST", {
            message:
              "Password must be at least 8 characters and include an uppercase letter, a number and a special character.",
          })
        }

        return
      }

      // Profile update: users must never change their own role
      if (ctx.path === "/update-user") {
        if (ctx.body?.role !== undefined) {
          throw new APIError("FORBIDDEN", {
            message: "Your account type can't be changed here.",
          })
        }

        // Name stays honest: 2 to 80 characters
        const name: unknown = ctx.body?.name
        const nameLength = typeof name === "string" ? name.trim().length : 0

        if (
          name !== undefined &&
          (typeof name !== "string" || nameLength < 2 || nameLength > 80)
        ) {
          throw new APIError("BAD_REQUEST", {
            message: "Name must be 2 to 80 characters.",
          })
        }
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
