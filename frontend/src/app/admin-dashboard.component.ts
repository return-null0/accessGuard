import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { VideoService } from './video.service';
import { catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="brand">
          <h2>Admin Console</h2>
        </div>
        <div class="user-badge" *ngIf="auth.isAdmin()">
          <span class="role-tag">ADMINISTRATOR</span>
        </div>
      </header>
    
      <div *ngIf="auth.isAdmin(); else accessDenied" class="main-content">
        
        <section class="card upload-card">
          <div class="card-header">
            <h3>Upload Manager</h3>
            <p class="subtitle">Select a video file to publish to the CDN</p>
          </div>
          
          <div class="upload-controls">
            <div class="file-input-wrapper">
              <input type="file" (change)="onFileSelected($event)" #fileInput id="file-upload" class="hidden-input">
              <label for="file-upload" class="file-label">
                <span class="folder-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon icon-folder-open">
  <path d="M4 4h6l2 2h8a2 2 0 0 1 2 2v4H3.8l-1.3 5H2V6a2 2 0 0 1 2-2z" />
  <path d="M22.5 10H4.5l-2 10h18l2-10z" />
</svg></span>
                <span *ngIf="!selectedFile">Choose File...</span>
                <span *ngIf="selectedFile" class="selected-name">{{ selectedFile.name }}</span>
              </label>
            </div>

            <button (click)="onUpload()" 
                    [disabled]="!selectedFile" 
                    class="btn btn-primary">
              <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-cloud">
  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
</svg></span> Upload Video
            </button>
          </div>
        </section>

        <section class="card list-card">
          <div class="card-header">
            <h3>Files</h3>
            <div class="badge-count" *ngIf="(videoService.videos$ | async) as list">
              {{ list.length }} Items
            </div>
          </div>
          
          <div class="video-list">
            <div class="list-header-row">
              <span>Filename</span>
              <span>Actions</span>
            </div>

            <div *ngFor="let videoUrl of videoService.videos$ | async" class="video-item">
              <div class="file-info">
                <span class="file-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon icon-clapperboard-open">
  <path d="M4 10h16v10c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V10z" />
  <path d="M21 8.5L4 3 3 6l17 5.5z" />
</svg></span>
                <span class="filename" title="{{ videoUrl }}">{{ getFilename(videoUrl) }}</span>
              </div>
              
              <div class="actions">
                <a [href]="videoUrl" target="_blank" class="btn-icon view" title="View"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon icon-play">
  <path d="M8 5v14l11-7z" />
</svg> </a>
                <button (click)="onDelete(videoUrl)" class="btn-icon delete" title="Delete"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon icon-trash">
  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
</svg></button>
              </div>
            </div>
            
            <div *ngIf="(videoService.videos$ | async)?.length === 0" class="empty-state">
              <div class="empty-icon">📭</div>
              <p>No media files found on the server.</p>
            </div>
          </div>
        </section>

      </div>

      <ng-template #accessDenied>
        <div class="access-denied-wrapper">
          <div class="error-card">
            <div class="lock-icon">🔒</div>
            <h3>Access Restricted</h3>
            <p>Your account permissions do not authorize access to the media management console.</p>
            <button class="btn btn-outline" (click)="logout()">Return to Login</button>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styleUrl: "./videoAdmindashboards.css"
})
export class AdminDashboardComponent {
  public auth = inject(AuthService);
  public videoService = inject(VideoService);
  private router = inject(Router);  

  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onUpload() {
    if (!this.selectedFile) return;

    this.videoService.uploadVideo(this.selectedFile).pipe(
      tap(() => {
        alert('Upload Successful');
        this.selectedFile = null;
        if(this.fileInput) this.fileInput.nativeElement.value = ''; 
      }),
      catchError(err => {
        alert('Upload Failed');
        return of(null);
      })
    ).subscribe();
  }

  onDelete(url: string) {
    if (!confirm('Are you sure you want to delete this file?')) return;
    this.videoService.deleteVideo(url).pipe(
      catchError(err => {
        alert('Delete Failed');
        return of(null);
      })
    ).subscribe();
  }

  getFilename(url: string): string {
    return url.split('/').pop() || '';
  }

  logout() {
    this.auth.logout();      
    this.router.navigate(['/login']);
  }
}