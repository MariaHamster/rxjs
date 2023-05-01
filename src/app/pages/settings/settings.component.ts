import {Component, OnDestroy, OnInit} from '@angular/core';
import {ObservableExampleService} from "../../services/testing/observable-example.service";
import {Subject, take, takeUntil} from "rxjs";
import {SettingService} from "../../services/settings/settings.service";


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  private subjectForSubscribe = new Subject();

  constructor(private observableService: ObservableExampleService,
              private settingsService: SettingService
  ) { }

  ngOnInit(): void {

    // settingsData observable
    this.settingsService.loadUserSettings().pipe(takeUntil(this.subjectForSubscribe)).subscribe((data) => {
      console.log('settings data', data)
    });

    //settings data subject
    this.settingsService.getSettingsSubjectObservable().pipe(take(1)).subscribe((data) => {
        console.log('settings data from subject', data)
      })

  }

  ngOnDestroy(): void {
    this.subjectForSubscribe.next(true);
    this.subjectForSubscribe.complete();
  }

}
