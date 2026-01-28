import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root' 

})
export class AuthService {

  private http = inject(HttpClient);

  constructor() {}

  login(credentials: { email: string; password: string }): Observable<any> {

    const url = `${environment.apiUrl}/api/auth/login`;
    return this.http.post<{token: string}>(url, credentials)
      .pipe(

        tap(response => localStorage.setItem('token', response.token))
      );

  }

  logout() {
    localStorage.removeItem('token');
  }
}