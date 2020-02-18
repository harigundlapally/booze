import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $ : any;
@Component({
  selector: 'app-my-wishlist',
  templateUrl: './my-wishlist.component.html',
  styleUrls: ['./my-wishlist.component.scss']
})
export class MyWishlistComponent implements OnInit {
  firstLoad = true;
  constructor( private router : Router) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();   
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
  }

  //productDetails
  viewProductDetails(productId){
    this.router.navigateByUrl('/product/'+productId);
  }

}
