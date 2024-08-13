import GoogleProvider from "next-auth/providers/google";
import db from "@repo/db/client";
import { AuthOptions, User, Account, Profile } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User;
      account: Account | null;
      profile?: Profile;
    }): Promise<boolean> {
      console.log("hi signin");

      // Check if user, account, or user email is null
      if (!user || !user.email || !account) {
        return false;
      }

      // Use Prisma to upsert the merchant record
      await db.merchant.upsert({
        where: {
          email: user.email,
        },
        create: {
          email: user.email,
          name: user.name || "",
          auth_type: account.provider === "google" ? "Google" : "Github",
        },
        update: {
          name: user.name || "",
          auth_type: account.provider === "google" ? "Google" : "Github",
        },
      });

      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "secret",
};
