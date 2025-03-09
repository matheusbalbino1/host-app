import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private _isOpen = new BehaviorSubject(false);
  public selectedRoute = '';

  constructor(private router: Router) {}

  public getSidebarSubject() {
    return this._isOpen.asObservable();
  }

  public toggleSidebar(isOpen: boolean) {
    this._isOpen.next(isOpen);
  }

  public setSelectedRoute(routes: Array<{ route: string }>) {
    for (const route of routes) {
      if (route.route === this.router.url) {
        this.selectedRoute = route.route;
      }
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        for (const route of routes) {
          if (route.route === event.urlAfterRedirects) {
            this.selectedRoute = route.route;
          }
        }
      });
  }
}
