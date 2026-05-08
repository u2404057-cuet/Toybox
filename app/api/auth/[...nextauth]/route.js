import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const handler = NextAuth({
  providers: [

    // Google OAuth
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Email + Password (calls Express backend)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res  = await fetch(`${BASE_URL}/api/auth/login`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ email: credentials.email, password: credentials.password }),
          })
          const json = await res.json()
          if (!json.success) return null

          // Return user + backendToken so we can store the JWT in the session
          return { ...json.data.user, backendToken: json.data.token }
        } catch {
          return null
        }
      },
    }),
  ],

  callbacks: {

    // Store backendToken and user info inside the JWT cookie
    async jwt({ token, user, account }) {
      // If account is present, it's the first time the token is created after sign in
      if (account?.provider === 'google' && user) {
        try {
          const res = await fetch(`${BASE_URL}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              googleId: account.providerAccountId,
              email: user.email,
              name: user.name,
              avatar: user.image,
            }),
          });
          const json = await res.json();
          if (json.success) {
            token.backendToken = json.data.token;
            token.is_admin = json.data.user.is_admin || false;
            token.dbId = json.data.user._id;
            token.name = json.data.user.name;
            token.avatar = json.data.user.avatar || user.image;
          }
        } catch (error) {
          console.error("Error connecting to backend for Google Login:", error);
        }
      } else if (user) {
        // This is for credentials provider
        token.backendToken = user.backendToken;
        token.is_admin = user.is_admin || false;
        token.dbId = user.dbId || user.id;
        token.name = user.name;
        token.avatar = user.avatar || user.image || null;
      }
      return token;
    },

    // Expose backendToken and user info to useSession() on the client
    async session({ session, token }) {
      if (token) {
        session.backendToken = token.backendToken;
        session.user.is_admin = token.is_admin;
        session.user.id = token.dbId;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },

  pages: {
    signIn: '/auth/login',
    error:  '/auth/login',
  },

  session: { strategy: 'jwt' },
  secret:  process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
