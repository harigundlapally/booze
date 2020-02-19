import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../apiservices/data-service.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

declare var $ : any;
@Component({
  selector: 'app-my-wishlist',
  templateUrl: './my-wishlist.component.html',
  styleUrls: ['./my-wishlist.component.scss']
})
export class MyWishlistComponent implements OnInit {
  firstLoad = true;
  allWishlists : any = [];
  private wishlistDataListnerSub : Subscription;
  constructor( private service: DataService,private router : Router) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();   
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
    this.getAllWishlist();
  }

  //get all wishlist
  getAllWishlist(){
    const isAuth = this.service.getIsAuth();
    if(isAuth){
      const allWishlists = this.service.getSyncWishlists();
      if(allWishlists){
        this.allWishlists = allWishlists['wishlist'];
      }else{
          this.service.get_service(DataService.apisList.wishlistData).subscribe(response => {
            if(response && response['result'] && response['result'].length) {
              this.allWishlists = response['wishlist'];
            }
          },(err) => {
            if(err){
              console.log(err);
            }
          });
      }
      
    }
  }

  //remove from wishlist
  removeFromWishlist(productId){
    let data = {
      productId,
    }
    this.service.post_service(DataService.apisList.removeFromWishlist,data).subscribe(response => {
      const allWishlists = this.allWishlists.filter(wishlist => wishlist.productId != productId);
      this.allWishlists = [...allWishlists];
      this.service.getWishlistData();
    },(err) => {
      if(err){
        console.log(err);
      }
    });
  }

  //shopNow
  shopNow(productId,quantity = 1){
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

  //productDetails
  viewProductDetails(productId){
    this.router.navigateByUrl('/product/'+productId);
  }

}
