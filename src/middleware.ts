import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { signToken, verifyToken } from "@/lib/auth/session";

const protectedRoutes = "/dashboard";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');
  const isProtectedRoute = pathname.startsWith(protectedRoutes);

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const res = NextResponse.next();

  if (sessionCookie) {
    try {
      await verifyToken().then(async () => {
        const { token } = await signToken();
        const expiresInOneHour = new Date(Date.now() + 60 * 60 * 1000);
        res.cookies.set({
          name: "session",
          value: token,
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          expires: expiresInOneHour,
        });
      });
    } catch (error: any) {
      console.error('Error updating session:', error.message);
      res.cookies.delete("session");
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
