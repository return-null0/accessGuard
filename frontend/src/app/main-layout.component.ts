import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { VideoDashboardComponent } from "./video-dashboard.component";
import { AuthService } from './auth.service';
import { AdminDashboardComponent } from "./admin-dashboard.component"; // Import the service

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, VideoDashboardComponent, AdminDashboardComponent],
  template: `
    
    <div class="sidebar">
      <div class="menu-spacer"></div> <button (click)="logout()" class="logout-btn">
        Sign Out
      </button>
    </div>
    <app-video-dashboard></app-video-dashboard>    
    <app-admin-dashboard></app-admin-dashboard>
    
    <div class="content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
.menu-spacer { flex: 1; }
    
    .logout-btn {
      background: #fee2e2;
      color: #ef4444;
      border: 1px solid #fecaca;
      padding: 10px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: bold;

      position: absolute;
  right: 0;
position: absolute;
  margin-right: 60px;
  margin-top: 20px;
    }
    .logout-btn:hover { background: #fecaca; }
  `]
})
export class MainLayoutComponent {
  private authService = inject(AuthService); 
  private router = inject(Router);           

  logout() {
    this.authService.logout();      
    this.router.navigate(['/login']);
  }
}