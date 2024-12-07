import { backend } from "@/services/backend";
import NextAuth, { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

// Extender el tipo Session para incluir accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password)
            throw new Error("Missing credentials");

          const { data } = await backend.post(`/auth/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });
          if (data?.error) throw new Error("Invalid credentials");

          return data.data;
        } catch {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: JWT; user?: any }) {
      // console.log("jwt", { token, user });

      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // console.log("session", { session, token });

      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // Ver ruta de inicio de sesión
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
