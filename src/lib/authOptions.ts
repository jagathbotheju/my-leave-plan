import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import prisma from "@/lib/prismadb";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import { getUserById } from "@/actions/userActions";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email Address",
          type: "email",
          placeholder: "Enter your e-mail address",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid Credentials");
        }

        // check user
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!user?.emailVerified) {
          throw new Error("Please check your Email to Activate Account");
        }

        if (!user || !user.hashedPassword)
          throw new Error("Invalid Credentials");

        //check password
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isPasswordCorrect) throw new Error("Invalid Credentials");

        //check email verified
        // if (!user.emailVerified)
        //   throw new Error("Please Verify your email address");

        const { hashedPassword, ...userWithoutPass } = user;

        return userWithoutPass;
      },
    }),
  ],
  callbacks: {
    //user is available only at signin time.
    //we need to add user to token and return, so session can have user
    async jwt({ token, user }) {
      if (user) {
        const response = await getUserById(user.id);
        token.user = user as User;
        if (response.success) token.user = response.user;
      }
      return token;
    },
    async session({ token, session }) {
      const user = token.user as User;
      if (user) {
        const response = await getUserById(user.id);
        session.user = token.user as User;
        if (response.success) session.user = response.user;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
};
