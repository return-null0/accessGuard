import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/videos`;

  private videosSubject = new BehaviorSubject<string[]>([]);

  public videos$ = this.videosSubject.asObservable();

  constructor() {

    this.refreshList();
  }

  refreshList() {
    this.http.get<string[]>(this.apiUrl).pipe(
      catchError(err => {
        console.error('Error fetching videos', err);
        return of([]);
      })
    ).subscribe(data => {
      this.videosSubject.next(data);
    });
  }

  uploadVideo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/upload`, formData, { responseType: 'text' }).pipe(
      tap(() => {

        this.refreshList();
      })
    );
  }

  deleteVideo(url: string): Observable<any> {
    const filename = url.split('/').pop();
    return this.http.delete(`${this.apiUrl}/${filename}`, { responseType: 'text' }).pipe(
      tap(() => {

        const currentList = this.videosSubject.value;
        const updatedList = currentList.filter(v => v !== url);
        this.videosSubject.next(updatedList);
      })
    );
  }
}