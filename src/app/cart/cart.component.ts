import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: []
})
export class CartComponent implements OnInit {
  firstLoad = true;
  constructor() { }

  ngOnInit() {
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
  }
}
