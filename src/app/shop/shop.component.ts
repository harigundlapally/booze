import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $ : any;
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  myMaxPrice : any = '200';
  maxPrice : any = 10;
  firstLoad = true;
  constructor(private router : Router) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();   
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
  }
  //get category range
  getCategoryRange(event){
    this.maxPrice = event.target.value;
  }
  //productDetails
  viewProductDetails(productId){
    this.router.navigateByUrl('/product/'+productId);
  }
}
