import NextAuth, { AuthError, CredentialsSignin } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { connectToDatabase } from "./lib/utils"
import User from "./models/userModel"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const email = credentials.email as string;
                const password = credentials.password as string;

                if (!email || !password)
                    throw new CredentialsSignin("Please provide both email and password")

                await connectToDatabase();

                const user = await User.findOne({ email }).select("+password");

                if (!user)
                    throw new CredentialsSignin({ cause: "Invalid email or password" })

                if (!user.password)
                    throw new CredentialsSignin({ cause: "Invalid email or password" })

                const isMatch = await compare(password, user.password);

                if (!isMatch)
                    throw new CredentialsSignin({ cause: "Invalid email or password" })

                return { name: user.name, email: user.email, id: user._id };
            }
        }),

    ],
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/signin",
    },
    callbacks: {
        signIn: async ({ user, account }) => {
            if (account?.provider === "google") {
                try {
                    const { email, name, image, id } = user;

                    await connectToDatabase();

                    const existingUser = await User.findOne({ email });

                    if (!existingUser) {
                        await User.create({ name, email, authId: id });
                    }

                    return true;
                } catch (error) {
                    throw new AuthError("Error while creating user")
                }
            }
            return false;
        }
    }
})