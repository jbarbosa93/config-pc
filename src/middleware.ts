import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const isFrance = hostname.includes('configpc-france.fr') || hostname.includes('configpc-france');

  const response = NextResponse.next();
  response.headers.set('x-market', isFrance ? 'fr' : 'ch');
  response.headers.set('x-hostname', hostname);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg).*)'],
};
