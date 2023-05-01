import { Injectable } from '@angular/core';
import {IUser} from "../../models/users";

@Injectable({
  providedIn: 'root'
  //root - это главный модуль (app.module.ts)
})
export class AuthService {

  private usersStorage: IUser[] = [];

  constructor() { }
  //проверка, насколько совпадают логин и пароль при авторизации
  checkUser(user: IUser): boolean | undefined {
    const isUserExists = this.usersStorage.find((el) => el.login === user.login);

    let isUserSavedInStore = window.localStorage.getItem('user_' + user?.login);
    let userInStore: IUser = <IUser>{};

    if (isUserSavedInStore) {
      userInStore = JSON.parse(isUserSavedInStore);
    }

    if (isUserExists) {
      return isUserExists.psw === user.psw;
    } else if (userInStore?.login) {
      return userInStore.psw === user.psw;
    }
    return false;
  }

  //в качестве хранения данных для пользователя будем использовать сервис
  setUser(user: IUser): void {
    const isUserExists = this.usersStorage.find((el) => el.login === user.login);
    if (!isUserExists && user?.login) {
      this.usersStorage.push(user);
    }
  }
  //проверка, повторяется ли уже зарегистрированный логин
  isUserExists(user: IUser): boolean {
    const isUserExists = this.usersStorage.find((el) => el.login === user.login);
    return !!isUserExists;
  }
  //Сохранение пользователя в локальное хранилище

}

