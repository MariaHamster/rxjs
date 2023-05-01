import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SettingsComponent} from "./settings.component";
import {SettingsRoutingModule} from "./settings-routing.module";
import {InputTextModule} from "primeng/inputtext";
import {ReactiveFormsModule} from "@angular/forms";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {TabViewModule} from "primeng/tabview";
import {ToastModule} from "primeng/toast";
import {TableModule} from "primeng/table";
import {StatisticComponent} from "./statistic/statistic.component";


@NgModule({
  declarations: [
    SettingsComponent,
    ChangePasswordComponent,
    StatisticComponent
  ],
  exports: [
    SettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    InputTextModule,
    ReactiveFormsModule,
    ToastModule,
    TabViewModule,
    TableModule
  ]
})
export class SettingsModule { }
