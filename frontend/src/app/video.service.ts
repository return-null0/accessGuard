import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/api/videos';

  getVideos(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }
}