import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../apiservices/data-service.service';
import { Subscription } from 'rxjs';
declare var $ : any;
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {
  myMinPrice : any = null;
  myMaxPrice : any = null;
  maxPrice : any = null;
  minPrice : any = null;
  firstLoad = true;
  totalProductsCount : number = 0;
  allProducts : any = [];
  allCategories : any = [];
  allWishlists : any = [];
  userIsAuthenticated : boolean = false;
  private wishlistDataListnerSub : Subscription;
  private authListnerSub : Subscription;
  constructor( private router: Router,public service : DataService) { }

  ngOnInit() {
    window.scroll(0,0);
    this.getCategories();
    this.getBrowseProducts();
    this.getSelectedWishlistList();
  }

  ngOnDestroy(){
    this.wishlistDataListnerSub.unsubscribe();
    this.authListnerSub.unsubscribe();
  }

  //get category range
  getCategoryRange(event){
    this.myMaxPrice = event.target.value;
    if(this.myMaxPrice){
      this.service.get_service(DataService.apisList.browseProductsByPrice+'?price='+this.myMaxPrice).subscribe(response => {
        this.allProducts = response && response['allProducts'].length ? response['allProducts'] : null;
        this.totalProductsCount = response['count'];
        if(this.allProducts.length){
          this.getProductPrice();
        }
        if(this.minPrice == null && this.maxPrice == null){
          this.minPrice = this.getProductMinPrice();
          this.maxPrice = this.getProductMaxPrice();
        }
      },(err) => {
        if(err){
          console.log(err);
        }
      });
    }
  }

  //get selected products
  getSelectedCategoriesProducts(catId){
    this.service.get_service(DataService.apisList.browseProductsByCategories+'?category='+catId).subscribe(response => {
      this.allProducts = response && response['allProducts'].length ? response['allProducts'] : null;
      this.totalProductsCount = response['count'];
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

  getSelectedWishlistList(){
    this.wishlistDataListnerSub = this.service.getWishlistDataStatusListner().subscribe(wishlistData => {
      this.allWishlists = wishlistData;
    });
  }

  //get all products
  getBrowseProducts(){
    this.userIsAuthenticated = this.service.getIsAuth();
    this.authListnerSub = this.service.getAuthStatusListner().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
    this.service.get_service(DataService.apisList.browseProducts+'?isLoggedIn='+this.userIsAuthenticated).subscribe(response => {
      this.allProducts = response && response['allProducts'].length ? response['allProducts'] : null;
      this.totalProductsCount = response['count'];
      this.getProductPrice();
      this.getProductMinPrice();
      this.myMaxPrice = this.maxPrice = this.getProductMaxPrice();
      this.myMinPrice = this.minPrice = this.getProductMinPrice();
    },(err) => {
      if(err){
        console.log(err);
      }
    });
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

  //get cart products
  getCategories(){
    var userId = localStorage.getItem('userId');
    this.service.get_service(DataService.apisList.browseCategories).subscribe(response => {
      let categories = response['allCategories'].reverse();
      let allCount = 0;
      categories.map(category => {
        if(category.categoryId != 'all'){
          category.count = +category.count;
          allCount += category.count;
        }
      });
      categories.filter(category => {
        if(category.categoryId == 'all'){
          category.count = allCount;
        }
      });
      this.allCategories = [...categories];
    },(err) => {
      if(err){
        console.log(err);
      }
    });
  }


  getProductPrice(){
    return this.allProducts.map(product => product.listPrice);
  }
  getProductMinPrice(){
    return Math.min(...this.getProductPrice());
  }
  getProductMaxPrice(){
    return Math.max(...this.getProductPrice());
  }


  sortProduct(e){
    let sort = e.target.value;
    this.service.get_service(DataService.apisList.browseProducts+'?sort='+sort).subscribe(response => {
      this.allProducts = response && response['allProducts'].length ? response['allProducts'] : null;
      this.totalProductsCount = response['count'];
      this.getProductPrice();
      if(this.minPrice == null && this.maxPrice == null){
        this.minPrice = this.getProductMinPrice();
        this.maxPrice = this.getProductMaxPrice();
      }
    },(err) => {
      if(err){
        console.log(err);
      }
    });
  }

}
