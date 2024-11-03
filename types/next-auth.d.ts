// types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      email?: string | null;
      token?: string;
      usersId?: string;
    };
  }
  
  interface JWT {
    accessToken?: string;
    email?: string | null;
    usersId?: string;
  }
}
