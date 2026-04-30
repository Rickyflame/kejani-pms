//lib/auth.ts

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization } from 'better-auth/plugins/organization';
import { db } from '@/db';
import * as schema from "@/db/schema";


export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),

  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    cookiePrefix: "kejani",
  },
  session: {
    cookieCache: {
      enabled: true,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "landlord",
        input: false, // Not accepted during sign-up; set by default or admin
      },
    },
  },
  organization: {
    // Automatically set the active organization to the first one
    // the user belongs to when they sign in
    allowUserToCreateOrganization: true,
  },

  plugins: [
    organization({
      //when new user signs up, auto create an Org
      allowUserToCreateOrganization: true,
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;