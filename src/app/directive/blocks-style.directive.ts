import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {TicketListComponent} from "../pages/tickets/ticket-list/ticket-list.component";

@Directive({
  selector: '[appBlocksStyle]',
  host: {
    '(document:keyup)': 'initKeyUp($event)'
  },
  exportAs: 'blocksStyle'
})
export class BlocksStyleDirective {
  @Input() selector: string;
  @Input() initFirst: boolean = false;

  @Output() renderComplete = new EventEmitter();

  private items: HTMLElement[];
  private index: number = 0;
  activeElementIndex: number = 0;

  constructor(private el: ElementRef,
              private ticketListComponent: TicketListComponent) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
  }

  ngAfterViewInit() {
    this.activeElementIndex = 0;
    if (this.selector) {
      this.items = this.el.nativeElement.querySelectorAll(this.selector)
      if (this.initFirst) {
        if (this.items[0]) {
          (this.items[0] as HTMLElement).setAttribute('style', 'border: 2px solid red')
        }
      }
    } else {
      console.error("Не передан селектор")
    }
    setTimeout(() => {
      this.renderComplete.emit(true)
    })
  }

  initKeyUp(ev: KeyboardEvent): void | boolean {

    if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
      if (ev.key === "ArrowLeft" && this.index === 0) {
      return false;
      }
      if (this.items[this.index]) {
        (this.items[this.index] as HTMLElement).removeAttribute('style')
      }
    }

    if (ev.key === 'ArrowRight') {
      if (this.index === (this.ticketListComponent.tickets.length - 1)) {
        if (this.items[this.index]) {
          (this.items[this.index] as HTMLElement).setAttribute('style', 'border: 2px solid red');
        }
        return false;
      }
      this.index++;
      if (this.items[this.index]) {
        (this.items[this.index] as HTMLElement).setAttribute('style', 'border: 2px solid red');
      }
    }
      if (ev.key === 'ArrowLeft') {
        if (this.index === 0) {
          return false;
        }
        this.index--;
        if (this.items[this.index]) {
          (this.items[this.index] as HTMLElement).setAttribute('style', 'border: 2px solid red');
        }
      }
    this.activeElementIndex = this.index;


  }

  initStyle(index: number) {
    if (this.items[index]) {
      (this.items[index] as HTMLElement).setAttribute('style', 'border: 2px solid red');
    } else if (!this.items[index]) {
      if (this.items[this.index]) {
        (this.items[index] as HTMLElement).removeAttribute('style');
      }
    }
  }

  updateItems(): void {
    this.items = this.el.nativeElement.querySelectorAll(this.selector);
  }

}
