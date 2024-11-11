import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const isLoggedIn = request.cookies.get('.AspNetCore.Identity.Application')?.value;

    if (!isLoggedIn && (request.nextUrl.pathname.startsWith('/events') || request.nextUrl.pathname.startsWith('/event'))) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// Настройка matcher для всех путей, начинающихся с '/events' или '/event'
export const config = {
    matcher: ['/events/:path*', '/event/:path*']
};
