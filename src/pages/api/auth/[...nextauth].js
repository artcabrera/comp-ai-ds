import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import Nyan from "../../../database/models/Nyan";
import dbconnect from "../../../database/dbconnect";

const nextAuthOptions = (req, res) => {
  return {
    providers: [
      CredentialProvider({
        name: "credentials",
        authorize: async (credentials) => {
          const { username, password } = credentials;
          await dbconnect();

          const user = await Nyan.login(username, password);
          if (user) return user;
          return null;
        },
      }),
    ],
    callbacks: {
      jwt: ({ token, user }) => {
        if (user) {
          token.id = user.id;
          token.role = user.role;
          token.firstname = user.firstname;
          token.lastname = user.lastname;
        }

        return token;
      },
      session: ({ session, token }) => {
        if (token) {
          session.id = token.id;
          session.role = token.role;
          session.firstname = token.firstname;
          session.lastname = token.lastname;
        }

        return session;
      },
    },
    session: {
      maxAge: 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
    jwt: {
      secret: process.env.NEXTAUTH_SECRET,
      encryption: true,
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/signin",
    },
  };
};

export default (req, res) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};
