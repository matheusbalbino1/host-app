import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  providers: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public username = '';
  public routes = [
    {
      label: 'Clientes',
      route: '/clients',
      callback: () => {
        this.router.navigate(['/clients']);
      },
    },
    {
      label: 'Clientes selecionados',
      route: '/clients/selected',
      callback: () => {
        this.router.navigate(['/clients/selected']);
      },
    },
    {
      label: 'Sair',
      route: '/login',
      callback: () => {
        this.router.navigate(['/login']);
      },
    },
  ];

  public isSidebarOpen = false;

  constructor(
    private router: Router,
    public sidebarService: SidebarService,
    private userService: UserService
  ) {
    this.userService.getUsernameObservable().subscribe((username) => {
      this.username = username;
    });
    this.sidebarService.setSelectedRoute(this.routes);
    this.sidebarService.getSidebarSubject().subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar(!this.isSidebarOpen);
  }
}
