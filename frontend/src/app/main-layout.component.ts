import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <nav>My App Navbar</nav>
    <div class="sidebar">My Sidebar</div>
    
    <div class="content">
      <router-outlet></router-outlet>
    </div>
  `
})
export class MainLayoutComponent {}