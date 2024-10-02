import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@/utils/pocketbase";

// For protected pages
// If auth is not valid for matching routes
// Redirect to a redirect path
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  const redirect_path = (url.pathname = "/");

  const cookieStore = cookies();

  const { authStore } = createServerClient(cookieStore);

  // Rutas que requieren autenticación de administrador
  const adminRoutes = ["/listausuarios", "/listapreguntas"];

  if (!authStore.isValid) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Restricted paths for admins only
  if (adminRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    if (!authStore.isAdmin) {
      console.error("Solo admins");
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login route)
     * - admin (admin login route)
     * - / (root path)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|admin|$).*)",
  ],
};
