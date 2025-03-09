import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private username = new BehaviorSubject<string>('');
  constructor() {}

  getUsername() {
    return this.username.getValue();
  }

  getUsernameObservable() {
    return this.username.asObservable();
  }

  setUsername(username: string) {
    this.username.next(username);
    return this.username.getValue();
  }
}
