import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { environment } from '../environments/environment';

interface LoginResponse {
  token: string;
  userId: number;
}

interface PermissionResponse {
  permissionId: number;
  role: string;         
  canUploadMedia: boolean;
  storageLimitMb: number;
}

@Injectable({
  providedIn: 'root' 
})
export class AuthService {

  private http = inject(HttpClient);
  
  private roleSignal = signal<string>('user');
  public isAdmin = computed(() => this.roleSignal() === 'admin');

  constructor() {
    const savedRole = localStorage.getItem('user_role');
    if (savedRole) {
      this.roleSignal.set(savedRole);
    }
  }


  login(credentials: { email: string; password: string }): Observable<PermissionResponse> {
    const loginUrl = `${environment.apiUrl}/api/auth/login`;
    
    return this.http.post<LoginResponse>(loginUrl, credentials).pipe(

      tap(loginRes => {
        localStorage.setItem('token', loginRes.token);
      }),

      switchMap(loginRes => {
        const permUrl = `${environment.apiUrl}/api/permissions/user/${loginRes.userId}`;

        const headers = new HttpHeaders().set('Authorization', `Bearer ${loginRes.token}`);
        
        return this.http.get<PermissionResponse>(permUrl, { headers });
      }),

      tap(permRes => {
        console.log('Permissions loaded for user:', permRes.role);
        
        localStorage.setItem('user_role', permRes.role);

        this.roleSignal.set(permRes.role); 
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    this.roleSignal.set('USER'); 
  }

  getVideos(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/api/videos`);
  }

  uploadVideo(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${environment.apiUrl}/api/videos/upload`, formData, {
      responseType: 'text' 
    });
  }

  deleteVideo(url: string): Observable<string> {
    const filename = url.substring(url.lastIndexOf('/') + 1);
    
    return this.http.delete(`${environment.apiUrl}/api/videos/${filename}`, {
      responseType: 'text'
    });
  }
}