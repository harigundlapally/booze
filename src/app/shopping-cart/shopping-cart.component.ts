import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $ : any;
@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  constructor( private router : Router) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip(); 
  }

  //productDetails
  viewProductDetails(productId){
    this.router.navigateByUrl('/product/'+productId);
  }

}
