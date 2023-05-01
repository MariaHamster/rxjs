import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TicketService} from "../../../services/ticket/ticket.service";
import {ITour, ITourTypeSelect} from "../../../models/tours";
import {ActivatedRoute, Router} from "@angular/router";
import {TicketsStorageService} from "../../../services/tiсkets-storage/tiсkets-storage.service";
import {BlocksStyleDirective} from "../../../directive/blocks-style.directive";
import {debounceTime, fromEvent, Subscription} from "rxjs";
import {UserService} from "../../../services/user/user/user.service";

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit, AfterViewInit, OnDestroy {
  tickets: ITour[]; //свойство для хранения данных
  renderComplete = false;
  private tourUnsubscriber: Subscription;
  ticketsCopy: ITour[];

  @ViewChild('tourWrap', {read: BlocksStyleDirective}) blockDirective: BlocksStyleDirective;
  @ViewChild('tourWrap') tourWrap: ElementRef<any>;

  @ViewChild('ticketSearch') ticketSearch: ElementRef;

  searchTicketSub: Subscription;
  ticketSearchValue: string;

  constructor(private ticketService: TicketService,
              private router: Router,
              private ticketStorage: TicketsStorageService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.userService.setToken('user-private-token');
    //подписка на данные, которые вернет Observable; data - результат, возвращаемый get
    this.ticketService.getTickets().subscribe(
      (data) => {
        this.tickets = data;
        this.ticketsCopy = [...this.tickets];
        this.ticketStorage.setStorage(data);
      }
    )

    //  1 вариант
    this.tourUnsubscriber = this.ticketService.ticketType$.subscribe((data: ITourTypeSelect) => {
      console.log('data', data)

      setTimeout(() => {
        this.blockDirective.updateItems();
        this.blockDirective.initStyle(0);  // сбрасываем индекс на 0 элемент
      });

      let ticketType: string;
      switch (data.value) {
        case "single":
          this.tickets = this.ticketsCopy.filter((el) => el.type === "single");
          break;
        case "multi":
          this.tickets = this.ticketsCopy.filter((el) => el.type === "multi");
          break;
        case "all":
          this.tickets = [...this.ticketsCopy];
          break;
      }
      if (data.date) {
        const dateWithoutTime = new Date(data.date).toISOString().split('T');
        const dateValue = dateWithoutTime[0]
        console.log('dateValue',dateValue)
        this.tickets = this.ticketsCopy.filter((el) => el.date === dateValue);
      }
    });
    //  2 вариант
    //this.tourUnsubscriber = this.ticketService.getTicketTypeObservable().subscribe((data:ITourTypeSelect) => {  console.log('data', data)  });
  }

  ngAfterViewInit() {
    // логика по поиску
    const fromEventObserver = fromEvent(this.ticketSearch.nativeElement, 'keyup');

    this.searchTicketSub = fromEventObserver.pipe(

      debounceTime(200)).subscribe((any) => {

      if (this.ticketSearchValue) {
        this.tickets = this.ticketsCopy.filter((el) => {
          //el.name.includes(this.ticketSearchValue)
          const name = typeof (el?.name) === "string" ? el.name.toLowerCase(): '';
          return name.includes(this.ticketSearchValue.toLowerCase());
        });
      } else {
        this.tickets = [...this.ticketsCopy];
      }
      });
  }

  ngOnDestroy() {
    this.tourUnsubscriber.unsubscribe();
    this.searchTicketSub.unsubscribe();
    this.userService.removeToken();
  }


  goToTicketInfoPage(item: ITour) {
    this.router.navigate([`/tickets/ticket/${item.id}`]).then(nav => {console.log(nav);
    }, err => {console.log(err)});
  }

  directiveRenderComplete(ev: boolean){
    const el: HTMLElement = this.tourWrap.nativeElement;
    el.setAttribute('style', 'background-color: #e0ffff')
    this.blockDirective.initStyle(0);
    this.renderComplete = true;
  }

  getTickets(): void {
    this.ticketService.getTickets().subscribe(
      (data) => {
        this.tickets = data;
        this.ticketsCopy = [...this.tickets];
        this.ticketStorage.setStorage(data);
      }
    )
  }

}
