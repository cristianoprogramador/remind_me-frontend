// src/app/auth/[...nextauth].ts
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
}

export const authOptions: NextAuthOptions = {
  secret: process.env.SECRET,
  session: {
    strategy: "jwt", // Utiliza JWT para sessões
  },
  jwt: {
    secret: process.env.JWT_SECRET, // Segredo para assinar os tokens JWT
    maxAge: 60 * 60 * 24 * 7, // Expira em uma semana
  },
  providers: [
    // Provedor GitHub
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // Provedor Google
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    // Provedor de Credenciais
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

          const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          });

          if (!res.ok) {
            throw new Error("Erro ao autenticar o usuário");
          }

          const user = await res.json();

          if (user && user.id) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image, // Caso você tenha uma imagem associada ao usuário
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
    async session({ session, token }) {
      const user = session.user as UserProps;
      if (user) {
        user.id = token?.sub || "";
        user.token = (token?.accessToken as string) || "";
      }
      return session;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = jwt.sign(
          { sub: user?.id || account.id },
          process.env.JWT_SECRET as string
        );
      }
      return token;
    },
    async signIn({ user, account }) {
      // Faz a requisição para o backend para verificar se o usuário já existe
      const res = await fetch(`${process.env.BACKEND_URL}/auth/check-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      });

      const existingUser = await res.json();

      if (existingUser && existingUser.id) {
        // Usuário já existe, retorna true
        return true;
      }

      // Se o usuário não existir, cria um novo
      const resCreate = await fetch(
        `${process.env.BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            image: user.image, // Caso você queira salvar uma imagem
          }),
        }
      );

      if (resCreate.ok) {
        return true;
      } else {
        console.error("Erro ao criar usuário");
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);
