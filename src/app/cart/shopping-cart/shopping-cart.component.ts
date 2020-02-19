import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../apiservices/data-service.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs';
declare var $ : any;
@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit,OnDestroy {
  firstLoad = true;
  cartTotal : number = 0;
  cartItems : any = [];
  private cartDataListnerSub :Subscription;
  constructor(private service:DataService, private router : Router) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
    if(!this.cartItems.length){
      this.getCartDataLocally();
    }
  }

  ngOnDestroy() {
    this.cartDataListnerSub.unsubscribe();
  }

  getCartDataLocally(){
    this.service.getCartData();
    this.cartDataListnerSub = this.service.getCartDataStatusListner().subscribe(cartInfo => {
      this.cartItems = cartInfo;
    });
  }

  //get cart item price
  getPriceIndividual(price,quantity){
    return (+price) * (+quantity)
  }

  //productDetails
  viewProductDetails(productId){
    this.router.navigateByUrl('/product/'+productId);
  }

  //update cart
  updateCart(type,index,cartItem){
    if(type === 'minus'){
      if(cartItem.quantity <= 1){
        return false;
      }
      cartItem.quantity  = (cartItem.quantity - 1);
      this.addToCart(cartItem.productInfo[0]._id,cartItem.quantity,'Minus');
    }
    if(type === 'plus'){
      if(cartItem.quantity < 0){
        return false;
      }
      cartItem.quantity  = (cartItem.quantity + 1);
      this.addToCart(cartItem.productInfo[0]._id,cartItem.quantity,'Plus');
    }
  }

  //Add to cart
  addToCart(productId,quantity = 1,type){
    let data = {
      productId,
      quantity,
      userId : localStorage.getItem('userId')
    }
    this.service.post_service(DataService.apisList.addToCart+'?cart=cart'+type,data).subscribe(response => {
      this.service.getCartData();
    },(err) => {
      if(err){
        console.log(err);
      }
      
    });
  }

  //Delete From Cart
  removeCartItem(currentCartItem,productId){
    let data = {
      productId,
      userId : localStorage.getItem('userId')
    }
    this.service.post_service(DataService.apisList.removeFromCart,data).subscribe(response => {
      this.service.getCartData();
      let cartItems = this.cartItems.filter(cart => cart.productInfo[0]._id != currentCartItem.productInfo[0]._id);
      if(cartItems.length){
        
      }
      this.cartItems = [...cartItems];
    },(err) => {
      if(err){
        console.log(err);
      }
      
    });
  }

  //remove wishlist item
  add_removeFromWishlist(selected,productId){
    let data = {
      productId,
      userId : localStorage.getItem('userId')
    }
    if(selected){
      this.service.post_service(DataService.apisList.removeFromWishlist,data).subscribe(response => {
        this.service.getCartData();
      },(err) => {
        if(err){
          console.log(err);
        }
        
      });
    }else{
        this.service.addToWishlist(data);
    }
  }
}
