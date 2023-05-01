import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {INearestTour, ITour, ITourLocation} from "../../../models/tours";
import {ActivatedRoute} from "@angular/router";
import {TicketsStorageService} from "../../../services/tiсkets-storage/tiсkets-storage.service";
import {IUser} from "../../../models/users";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user/user/user.service";
import {TicketService} from "../../../services/ticket/ticket.service";
import {forkJoin, fromEvent, Subscription} from "rxjs";

@Component({
  selector: 'app-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss']
})
export class TicketItemComponent implements OnInit, AfterViewInit, OnDestroy {
  ticket: ITour | undefined;
  user: IUser | null;
  userForm: FormGroup;

  nearestTours: INearestTour[];
  toursLocation: ITourLocation[];

  @ViewChild('TicketSearch') ticketSearch: ElementRef;
  searchTicketSub: Subscription;
  ticketRestSub: Subscription;
  searchTypes = [1, 2, 3];
  ticketSearchValue: string;

  constructor(private route: ActivatedRoute,
              private ticketStorage: TicketsStorageService,
              private userService: UserService,
              private ticketService: TicketService) { }

  ngOnInit(): void {
    // first get userInfo
    this.user = this.userService.getUser()

    //init formGroup
    this.userForm = new FormGroup({
      firstName: new FormControl('m', {validators: Validators.required}),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      cardNumber: new FormControl(''),
      birthDay: new FormControl(),
      age: new FormControl(),
      citizen: new FormControl(),
    });

    // get nearest tours
    forkJoin([this.ticketService.getNearestTours(), this.ticketService.getToursLocation()]).
    subscribe((data) => {
      //console.log('data', data);
      this.nearestTours = data[0];
      //this.toursLocation = data[1];
      this.nearestTours = this.ticketService.transformData(data[0],data[1]);
    })

    // params
    const routeIdParam = this.route.snapshot.paramMap.get('id');
    const queryIdParam = this.route.snapshot.queryParamMap.get('id');

    const paramValueId = routeIdParam || queryIdParam;

    if(paramValueId){
      const ticketStorage = this.ticketStorage.getStorage()
      this.ticket = ticketStorage.find((el) => el.id === paramValueId);
      console.log('this.ticket', this.ticket)
    }
  }

  ngAfterViewInit(): void {
    //setCardNumber
    this.userForm.controls["cardNumber"].setValue(this.user?.cardNumber);

    // this.userForm.patchValue({
    //   cardNumber: this.user.cardNumber
    // });

    //ticketSearchValue
    const fromEventObserver = fromEvent(this.ticketSearch.nativeElement, 'keyup')
    this.searchTicketSub = fromEventObserver.subscribe((ev: any) => {
      this.initSearchTour()
    });
  }

  ngOnDestroy(): void {
    this.searchTicketSub.unsubscribe();
  }

  initSearchTour(): void {
    const type = Math.floor(Math.random() * this.searchTypes.length);
    //unsubscribe
    if (this.ticketRestSub && !this.searchTicketSub.closed) {
      this.ticketRestSub.unsubscribe();

      this.ticketRestSub = this.ticketService.getRandomNearestEvent(type).subscribe((data) => {
        this.nearestTours = this.ticketService.transformData([data], this.toursLocation)
      });
    }
  }

  onSubmit(): void {
  }

  selectDate(ev: Event): void {
  }

  initTour(): void {

    const userData = this.userForm.getRawValue();
    const postData = {...this.ticket, ...userData};
    this.ticketService.sendTourData(postData).subscribe()
    // console.log('postData', postData)
    // console.log('   this.userForm.getRawValue()', this.userForm.getRawValue())
  }

}
