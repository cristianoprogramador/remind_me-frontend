import NextAuth, { NextAuthOptions, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

interface UserProps {
  id: string;
  token: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 60 * 60 * 24 * 7,
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: "NextAuthCredentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Credenciais inválidas");
        }

        try {
          const { email, password } = credentials;

          const res = await fetch(
            `${process.env.NEXTAUTH_URL_INTERNAL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email,
                password,
              }),
            }
          );

          if (!res.ok) {
            throw new Error("Erro ao autenticar o usuário");
          }

          const data = await res.json();

          if (data && data.user.uuid) {
            return {
              id: data.user.uuid,
              name: data.user.name,
              email: data.user.email,
              image: data.user.image,
              role: data.user.role,
            };
          } else {
            throw new Error("Usuário não encontrado ou senha incorreta");
          }
        } catch (error) {
          console.error("Erro na autenticação:", error);
          throw new Error("Erro ao autorizar o usuário.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, session, user, trigger }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.sub = user.id;
        token.role = user.role;
      } else if (trigger === "update" && session) {
        return { ...token, ...session?.user };
      } else if (token.sub && !token.accessToken) {
        token.accessToken = jwt.sign(
          { sub: token.sub },
          process.env.JWT_SECRET as string
        );
      }
      return token;
    },
    async session({ session, token }) {
      const user = session.user as UserProps;
      if (user) {
        user.id = token?.sub || "";
        user.token = (token?.accessToken as string) || "";
        user.name = token.name || "";
        user.role = token.role || "";
      }
      return session;
    },
    async signIn({ user, account }) {
      const res = await fetch(
        `${process.env.NEXTAUTH_URL_INTERNAL}/auth/check-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        }
      );

      const existingUser = await res.json();

      if (existingUser && existingUser.id) {
        user.id = existingUser.id;
        user.name = existingUser.name;
        user.role = existingUser.role;
        return true;
      }

      const resCreate = await fetch(
        `${process.env.NEXTAUTH_URL_INTERNAL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            image: user.image,
          }),
        }
      );

      const newUser = await resCreate.json();
      if (resCreate.ok && newUser.id) {
        user.id = newUser.id;
        user.role = newUser.role;
        return true;
      } else {
        console.error("Erro ao criar usuário");
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);
