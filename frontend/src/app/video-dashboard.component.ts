import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from './video.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-video-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      
      <div class="header">
        <h1>Secure Video Library</h1>
        <p class="subtitle">Protected Content Delivery Network</p>
      </div>

      <div *ngIf="selectedVideo" class="main-stage">
        <div class="video-wrapper">
          <video [src]="selectedVideo" controls autoplay class="stage-player"></video>
        </div>
        <div class="stage-info">
          <h3>{{ getFileName(selectedVideo) }}</h3>
          <button (click)="closePlayer()" class="close-btn">Close Player</button>
        </div>
      </div>

      <div class="video-grid">
        <div 
          *ngFor="let videoUrl of videos$ | async" 
          class="video-card" 
          (click)="playVideo(videoUrl)"
        >
          <div class="thumbnail-wrapper">
            <video 
              [src]="videoUrl + '#t=0.5'" 
              preload="metadata" 
              muted 
              class="thumbnail-video"
            ></video>
            <div class="play-overlay">
              <span class="play-icon">▶</span>
            </div>
          </div>
          
          <div class="card-info">
            <span class="filename">{{ getFileName(videoUrl) }}</span>
          </div>
        </div>
      </div>

      <div *ngIf="(videos$ | async) === null" class="loading">
        <div class="spinner"></div>
        <p>Loading secure assets...</p>
      </div>
       <div *ngIf="(videos$ | async)?.length === 0" class="loading">
        <p>No videos available.</p>
      </div>

    </div>
  `,
  styleUrl: "./videoAdmindashboards.css"
})
export class VideoDashboardComponent {
  
  private videoService = inject(VideoService);
  videos$: Observable<string[]> = this.videoService.videos$;
  selectedVideo: string | null = null;

  getFileName(url: string): string {
    return url.split('/').pop() || 'Unknown Video';
  }

  playVideo(url: string) {
    this.selectedVideo = url;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closePlayer() {
    this.selectedVideo = null;
  }
}