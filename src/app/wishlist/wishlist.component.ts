import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $ : any;
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  constructor( private router : Router) { }


  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();   
  }

  //productDetails
  viewProductDetails(productId){
    this.router.navigateByUrl('/product/'+productId);
  }

}
