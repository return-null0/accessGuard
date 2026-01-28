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
        <p class="subtitle">Accessing: /var/www/cdn</p>
      </div>

      <div *ngIf="selectedVideo" class="main-stage">
        <video [src]="selectedVideo" controls autoplay class="stage-player"></video>
        <div class="stage-info">
          <h3>{{ getFileName(selectedVideo) }}</h3>
          <button (click)="selectedVideo = null" class="close-btn">Close Player</button>
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
            <div class="play-overlay">▶</div>
          </div>
          
          <div class="card-info">
            <span class="filename">{{ getFileName(videoUrl) }}</span>
          </div>
        </div>
      </div>

      <div *ngIf="(videos$ | async) === null" class="loading">
        Loading secure assets...
      </div>

    </div>
  `,styleUrl: './app.component.css'
})
export class VideoDashboardComponent {
    
  private videoService = inject(VideoService);
  
  // The list of video URLs from the backend
  videos$: Observable<string[]> = this.videoService.getVideos();

  // Tracks which video is currently playing in the main stage
  selectedVideo: string | null = null;

  getFileName(url: string): string {
    return url.split('/').pop() || 'Unknown Video';
  }

  playVideo(url: string) {
    this.selectedVideo = url;
    // Scroll to top to see player
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}