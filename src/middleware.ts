// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { UserExt } from "./lib/types";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const { pathname, origin } = req.nextUrl;
    const { token } = req.nextauth;
    const user = token?.user as UserExt;

    if (pathname.startsWith("/admin") && user?.role !== "ADMIN") {
      return NextResponse.redirect(`${origin}/auth/not-authorized`);
      //return new NextResponse("You are not Authorized");
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/", "/profile/:path*", "/leave/:path*", "/admin/:path*"],
};
