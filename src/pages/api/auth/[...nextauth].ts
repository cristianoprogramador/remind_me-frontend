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

          const res = await fetch(`${process.env.NEXTAUTH_URL_INTERNAL}/auth/login`, {
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
              image: user.image,
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
    async jwt({ token, account, user }) {
      if (user) {
        // Quando um usuário faz login, 'user.id' é o UUID do banco de dados
        token.sub = user.id;
      } else if (token.sub && !token.accessToken) {
        // Se o token já foi criado e estamos renovando, continue usando o sub existente
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
      }
      return session;
    },
    async signIn({ user, account }) {
      // Faz a requisição para o backend para verificar se o usuário já existe
      const res = await fetch(`${process.env.NEXTAUTH_URL_INTERNAL}/auth/check-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      });

      const existingUser = await res.json();

      if (existingUser && existingUser.id) {
        // Se o usuário já existe, define 'user.id' como o UUID do banco de dados
        user.id = existingUser.id;
        return true;
      }

      // Se o usuário não existir, cria um novo e atribui o UUID ao 'user.id'
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
        user.id = newUser.id; // Usa o UUID recém-criado do banco de dados
        return true;
      } else {
        console.error("Erro ao criar usuário");
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);
