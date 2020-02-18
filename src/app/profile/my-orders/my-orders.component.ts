import { Component, OnInit } from '@angular/core';
declare var $ : any;
@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  firstLoad = true;
  constructor() { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();   
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
  }

}
