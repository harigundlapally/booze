import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.scss']
})
export class OrderPaymentComponent implements OnInit {
  firstLoad = true;
  constructor() { }

  ngOnInit() {
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
  }

}
