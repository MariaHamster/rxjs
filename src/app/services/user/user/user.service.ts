import { Injectable } from '@angular/core';
import {IUser} from "../../../models/users";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: IUser | null;
  private  token: string | null;

  constructor() { }

  getUser(): IUser | null{
    return this.user; // возвращается user
  };
  setUser(user: IUser) {
    this.user = user; // записывается пользователь в this.user
  };

  setToken(token: string): void {
    this.token = token;
    window.localStorage.setItem('userToken', JSON.stringify(token));  //устанавливаем токен в userService и в localStorage
  }
  getToken(): string | null {
    console.log('getToken()');
    return this.token || window.localStorage.getItem('userToken'); //проверяем - если есть токен в сервисе, то берем его из сервиса, если нет, то из хранилища по ключу
  }

  removeToken(): void {
    console.log('removeToken()');
    //this.user = null;
    this.token = null;
    window.localStorage.removeItem('userToken');
  }


}
