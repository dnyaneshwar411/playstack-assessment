import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const unAuthWorkspaceRoutes = ["/login"]

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookiesList = await cookies();
  const access = cookiesList.get("access")?.value;
  const unAuthorized = unAuthWorkspaceRoutes.includes(pathname)

  if (!access && !unAuthorized) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (access && pathname === "/login") {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|[\\w-]+\\.\\w+).*)'
  ]
};