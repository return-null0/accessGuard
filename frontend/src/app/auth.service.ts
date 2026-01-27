import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root' // Makes this available everywhere
})
export class AuthService {
  // Inject HttpClient to make real API requests
  private http = inject(HttpClient);
  
  constructor() {}

  login(credentials: { email: string; password: string }): Observable<any> {
    
    const url = `${environment.apiUrl}/api/auth/login`;
    return this.http.post<{token: string}>(url, credentials)
      .pipe(
        // Automatically save the token when the request succeeds
        tap(response => localStorage.setItem('token', response.token))
      );
    

 
  }

  logout() {
    localStorage.removeItem('token');
  }
}