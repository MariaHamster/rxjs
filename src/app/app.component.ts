import { Component } from '@angular/core';
import {ObservableExampleService} from "./services/testing/observable-example.service";
import {ConfigService} from "./services/configService/config.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ticketSales2022';
  prop: string;

  constructor(private testing: ObservableExampleService,
              private configService: ConfigService) {
    testing.initObservable()
  }

  ngOnInit() {
    this.configService.configLoad();
    // const myObservable = this.testing.getOservable();
    // myObservable.subscribe((data) => {
    //   console.log('first myObservable data', data)
    // });
    // myObservable.subscribe((data) => {
    //   console.log('second myObservable data', data)
    // });
    //
    // const mySubject = this.testing.getSubject();

  }
}
