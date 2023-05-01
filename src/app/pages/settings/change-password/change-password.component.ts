import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user/user/user.service";
import {MessageService} from "primeng/api";
import {IUser} from "../../../models/users";


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;

  constructor(private userService: UserService,
              private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    //init formGroup
    this.passwordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required, Validators.minLength(1)]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(1)]),
      repeatPassword: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });
  }


  onSubmit(): void {
  }

  changePassword(ev: Event): void | boolean {
    const userPassword = this.userService.getUser()?.psw;

    if (userPassword !== this.oldPassword) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Текущий пароль введен неверно'});
      return false;
    }
    if (this.newPassword !== this.repeatPassword) {
      this.messageService.add({severity: 'warn', summary: 'Error', detail: 'Пароли не совпадают'});
      return false;
    } else {
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Пароль успешно изменён'});
      const user = this.userService.getUser();
      const newUser = <IUser> {...user};
      newUser.psw = this.newPassword;
      this.userService.setUser(newUser);
      window.localStorage.setItem('user_' + newUser.login, JSON.stringify(newUser));
    }

  }

}
