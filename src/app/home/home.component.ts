import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../apiservices/data-service.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
declare var $ : any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,OnDestroy {
  firstLoad = true;
  allProducts : any;
  bestSellerProducts : any;
  mostPopularProducts : any;
  bannerProducts : any;
  userIsAuthenticated : boolean = false;
  private authListnerSub : Subscription;
  constructor(private service : DataService, private router : Router) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();   
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
    this.getProducts();
  }

  ngOnDestroy(){
    this.authListnerSub.unsubscribe();
  }

  //view product details
  viewProductDetails(productId){
    this.router.navigateByUrl('/product/'+productId);
  }
  //Add to cart
  addToCart(productId,quantity=1){
    let data = {
      productId,
      quantity,
      userId : localStorage.getItem('userId')
    }
    this.service.post_service(DataService.apisList.addToCart+'?cart=listPage',data).subscribe(response => {
      this.service.getCartData();
    },(err) => {
      if(err){
        console.log(err);
      }
    });
  }

  //Delete From Cart
  deleteFromCart(productId){
    let data = {
      productId,
      userId : localStorage.getItem('userId')
    }
    this.service.post_service(DataService.apisList.removeFromCart,data).subscribe(response => {
      this.service.getCartData();
    },(err) => {
      if(err){
        console.log(err);
      }
    });
  }

   //Add to cart
   add_removeFromWishlist(selected,productId,products,product){
    let data = {
      productId,
      userId : localStorage.getItem('userId')
    }
    const currentIndex = products.findIndex(prod => prod._id === product._id);
    if(selected){
      this.service.post_service(DataService.apisList.removeFromWishlist,data).subscribe(response => {
        this.service.getCartData();
        let currentItem = products.find((element) => { return element._id === product._id });
        currentItem.selected = !currentItem.selected;
        products[currentIndex] = {...currentItem};

      },(err) => {
        if(err){
          console.log(err);
        }
      });
    }else{
        this.service.addToWishlist(data);
        let currentItem = products.find((element) => { return element._id === product._id });
        currentItem.selected = !currentItem.selected;
        products[currentIndex] = {...currentItem};
    }
  }

  //Delete From Wishlist
  deleteFromWishlist(productId){
    let data = {
      productId,
      userId : localStorage.getItem('userId')
    }
    this.service.post_service(DataService.apisList.removeFromWishlist,data).subscribe(response => {
      console.log(response);
    },(err) => {
      if(err){
        console.log(err);
      }
    });
  }

  //load homepage products
  getProducts(){
    this.userIsAuthenticated = this.service.getIsAuth();
    this.authListnerSub = this.service.getAuthStatusListner().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
    this.service.get_service(DataService.apisList.browseProducts+'?isLoggedIn='+this.userIsAuthenticated).subscribe(response => {
      this.allProducts = response && response['allProducts'].length ? response['allProducts'] : null;
      this.bestSellerProducts = this.allProducts.filter(product => product.bestSellerProduct == true);
      this.mostPopularProducts = this.allProducts.filter(product => product.featuredProduct == true);
      this.bannerProducts = this.allProducts.filter(product => product.bannerProduct == true);
    },(err) => {
      if(err){
        console.log(err);
      }
    });
  }
}
