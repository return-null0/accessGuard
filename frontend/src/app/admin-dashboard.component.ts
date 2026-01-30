import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, catchError, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <header>
        <h2>CDN (Admin)</h2>
        <button *ngIf="auth.isAdmin()" (click)="auth.logout()" class="logout-btn">
          Logout
        </button>
      </header>
    
      <div *ngIf="auth.isAdmin(); else accessDenied">
        
        <div class="admin-panel">
          <h3>Upload Manager</h3>
          <input type="file" (change)="onFileSelected($event)" #fileInput>
          <button (click)="onUpload()" [disabled]="!selectedFile">
            Upload Video
          </button>
        </div>

        <div class="video-list">
          <h3>File Registry</h3>
          
          <div *ngFor="let videoUrl of videos$ | async" class="video-item">
            <span class="filename">{{ getFilename(videoUrl) }}</span>
            <div class="actions">
              <button (click)="onDelete(videoUrl)" class="delete-btn">
                Delete
              </button>
            </div>
          </div>
          
          <div *ngIf="(videos$ | async)?.length === 0" class="empty-state">
            No videos found on server.
          </div>
        </div>

      </div>

      <ng-template #accessDenied>
        <div class="error-msg">
          <h3>Access Denied</h3>
          <p>You do not have permission to manage these files.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .container { padding: 20px; font-family: sans-serif; max-width: 800px; margin: 0 auto; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    
    .admin-panel { border: 1px solid #4caf50; padding: 20px; margin-bottom: 30px; background: #f9fdf9; border-radius: 8px; }
    .logout-btn { background: #555; color: white; border: none; padding: 8px 16px; cursor: pointer; border-radius: 4px; }
    
    .video-item { display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #eee; align-items: center; }
    .filename { font-family: monospace; font-size: 1.1em; color: #333; }
    
    .delete-btn { background: #f44336; color: white; border: none; padding: 6px 12px; cursor: pointer; border-radius: 4px; }
    .delete-btn:hover { background: #d32f2f; }
    
    .empty-state { padding: 30px; text-align: center; color: #888; font-style: italic; background: #fafafa; border-radius: 8px; }
    .error-msg { text-align: center; color: #d32f2f; margin-top: 50px; }
  `]
})
export class AdminDashboardComponent {
  public auth = inject(AuthService);
  selectedFile: File | null = null;

  // Trigger for refreshing the list
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);

  // The video list stream
  videos$: Observable<string[]> = this.refreshTrigger$.pipe(
    switchMap(() => this.auth.getVideos().pipe(
      catchError(err => {
        console.error('Error loading videos:', err);
        return of([]); 
      })
    ))
  );

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onUpload() {
    if (!this.selectedFile) return;

    this.auth.uploadVideo(this.selectedFile).pipe(
      tap(() => {
        // Reset state
        this.selectedFile = null;
        // Optional: clear the actual input DOM element if you view-child it, 
        // but for now we just alert and refresh.
        alert('Upload Successful');
        this.refreshTrigger$.next(); 
      }),
      catchError(err => {
        alert('Upload Failed');
        return of(null);
      })
    ).subscribe();
  }

  onDelete(url: string) {
    if (!confirm('Are you sure you want to delete this file?')) return;

    this.auth.deleteVideo(url).pipe(
      tap(() => {
        this.refreshTrigger$.next(); 
      }),
      catchError(err => {
        alert('Delete Failed');
        return of(null);
      })
    ).subscribe();
  }

  getFilename(url: string): string {
    return url.substring(url.lastIndexOf('/') + 1);
  }
}