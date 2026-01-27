import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  
    const router = inject(Router);
  const token = localStorage.getItem('token'); // match your storage key

  if (token && !isTokenExpired(token)) {
    return true;
  }

  // Token is missing or expired: Redirect to login
  // Optional: Add `?returnUrl` to redirect back after login
  return router.createUrlTree(['/login'], { 
    queryParams: { returnUrl: state.url } 
  });
};

/**
 * Helper: Decodes JWT and checks if it is expired.
 * No external libraries required.
 */
function isTokenExpired(token: string): boolean {
  try {
    // 1. Get the payload part of the JWT (header.payload.signature)
    const base64Url = token.split('.')[1];
    
    // 2. Convert Base64Url to Base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // 3. Decode and parse
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);

    // 4. Check 'exp' claim (time is in seconds, Date.now is in ms)
    if (!payload.exp) return false; 
    
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= payload.exp;
    
  } catch (error) {
    // If decoding fails, the token is effectively invalid
    return true; 
  }
}