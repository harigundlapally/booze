import { environment } from '../../environments/environment';
import { Injectable, ViewContainerRef } from '@angular/core';
import { Observable,of,throwError,pipe, Subject, BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Http,Response,RequestOptions } from '@angular/http';
import { map,catchError,filter,mergeMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseUrl = environment.backendUrl;
  cartActive : boolean = false;
  wishlistCount : number = 0;
  isAuthenticated:boolean = false;
  cartInfo: any;
  wishlists : any;
  nextRoute : string;
  public :boolean = false;
  private tokenTimer:any;
  private token: string;
  private authStatusListner = new Subject<boolean>();
  private loaderStatusListner = new Subject<boolean>();
  private cartStatusListner = new Subject<number>();
  private wishlistStatusListner = new Subject<number>();
  private addressListner = new Subject<any>();
  private cartDataStatusListner = new Subject<Object>();
  private wishlistDataStatusListner = new Subject<any>();
  private orderHistoryListner = new Subject<Object>();
  public cartData: any;
  public orderToken : string;
  public orderType : string;
  public static apisList = {
    signup : '/api/user/signup',
    login : '/api/user/login',
    browseCategories : '/api/category',
    browseProductsByCategories : '/api/product/browse',
    browseProducts : '/api/product/browse',
    browseProductsByPrice : '/api/product/browseByPrice',
    productDetails : '/api/product/',
    addToCart : '/api/cart/save',
    removeFromCart : '/api/cart/delete',
    addToWishlist : '/api/wishlist/save',
    removeFromWishlist : '/api/wishlist/delete',
    cartCountHeader : '/api/cart',
    cartData : '/api/cart/cartItems',
    wishlistData : '/api/wishlist',
    getAddresses : '/api/address',
    addAddress : '/api/address/save',
    deleteAddress : '/api/address/delete',
    editAddress : '/api/address/update',
    makeDefaultAddress : '/api/address/update',
    makePayment : '/api/order',
    getOrders : '/api/order',
    getUser : '/api/user/userInfo',
    updateUser : '/api/user/updateUser',
    updatePassword : '/api/user/updatePassword'
  }

  constructor(private httpClient: HttpClient, private router: Router) {
    this.router.events.subscribe((event: any) => {
        // if (event instanceof NavigationEnd) {
        //   if(this.router.url == '/cart/shopping-cart'){
        //     this.nextRoute = '/cart/shipping-address';
        //   }else if(this.router.url == '/cart/shipping-address'){
        //     this.nextRoute = '/cart/order-payment';
        //   }else if(this.router.url == '/cart/order-payment'){
        //     this.nextRoute = 'order-payment';
        //   }
        // }
    });
  }
  
  //get auth listner
  getAuthStatusListner(){
    return this.authStatusListner.asObservable();
  }

  //get cart count
  getCartStatusListner(){
    return this.cartStatusListner.asObservable();
  }

  //get wishlist count
  getWishlistStatusListner(){
    return this.wishlistStatusListner.asObservable();
  }

  //get cart data
  getCartDataStatusListner(){
    return this.cartDataStatusListner.asObservable();
  }

  //get cart data
  getWishlistDataStatusListner(): Observable<any>{
    return this.wishlistDataStatusListner.asObservable();
  }

  getSyncWishlists() {
      return this.wishlists;
  }

  //get default address
  getAddressListner(){
    return this.addressListner.asObservable();
  }

  //get order history
  getOrderHistoryListner(){
    return this.orderHistoryListner.asObservable();
  }

  //for AuthToken If Its Available
  getAuthToken() {
    if (localStorage.getItem('Authorization') != null) {
      let apiKey =  localStorage.getItem('Authorization');
      return 'Bearer '+apiKey;
    } else {
      return '';
    }
  }

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getCartData(){
    const isAuth = this.getIsAuth();
    if(isAuth){
      const userId = localStorage.getItem('userId');
      this.get_service(DataService.apisList.cartData+'/'+userId).subscribe(response => {
        if(response && response['result'] && response['result'].length) {
          let count = 0;
          response['result'].map(cart => count += cart.quantity);
          this.cartStatusListner.next(count);
          this.cartDataStatusListner.next(response['result']);
          this.cartData = response['result'];
          if(this.router.url == '/cart/shopping-cart' || this.router.url == '/home' || this.router.url == '/shop' || this.router.url == ''){
            this.getWishlistData();
          }
          
        }else{
          this.cartStatusListner.next(0);
        }
      },(err) => {
        if(err){
          console.log(err);
        }
        
      });
    }
  }

  //wishlistStatusListner
  getWishlistData(){
    const isAuth = this.getIsAuth();
    if(isAuth){
      this.get_service(DataService.apisList.wishlistData).subscribe(response => {
        if(response && response['result'] && response['result'].length) {
          this.wishlistStatusListner.next(response['result'].length);
          this.wishlistDataStatusListner.next(response['result']);
          this.wishlists = response;
          this.getSyncWishlists();
          
          return response;
        }else{
          this.wishlistStatusListner.next(0);
        }
      },(err) => {
        if(err){
          console.log(err);
        }
        
      });
    }
  }

  addToWishlist(data){
    this.post_service(DataService.apisList.addToWishlist,data).subscribe(response => {
      if(response){
        this.getCartData();
      }
    },(err) => {
      if(err){
        console.log(err);
      }
      
    });
  }

  getAllAddresses(){
    const userId = localStorage.getItem('userId');
    this.get_service(DataService.apisList.getAddresses+'/'+userId).subscribe(response => {
      if(response && response['result'] && response['result'].length) {
        this.addressListner.next(response['result']);
      }else{
        this.cartStatusListner.next(0);
      }
      
    },(err) => {
      if(err){
        console.log(err);
      }
      
    });
  }

  makePayment(){
    let orderHistory = {};
  }

  logout(){
    this.token = null;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigateByUrl('/');
  }

  loginSubmit(data){
    this.post_service(DataService.apisList.login,data).subscribe(response => {
      const token = response['token'];
      this.token = token;
      if(token){
        const expiresDuration = response['expiresIn'];
        this.setAuthTimer(expiresDuration);
        this.isAuthenticated = true;
        this.authStatusListner.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresDuration * 1000);
        this.saveAuthData(token,expirationDate);
        localStorage.setItem('userId',response['user']['_id']);
        this.getCartData();
        this.getWishlistData();
      }
      this.router.navigateByUrl('/');
    },(err) => {
      if(err){
        console.log(err);
      }
      
    });
  }

  //auto Auth user
  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expires = authInformation.expirationDate.getTime() - now.getTime();
    if(expires > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expires / 1000);
      this.authStatusListner.next(true);
    }else{
      this.logout();
    }
  }

  private saveAuthData(token : string, expirationDate : Date){
    localStorage.setItem('token',token);
    localStorage.setItem('expirationDate',expirationDate.toISOString());
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate =  localStorage.getItem('expirationDate');
    if(!token || !expirationDate){
      return;
    }
    return{
      token,
      expirationDate: new Date(expirationDate)
    }
  }

  private setAuthTimer(duration:number){
    this.tokenTimer = setTimeout(() => {
        this.logout();
    }, duration * 1000);
  }

  //Get request
  get_service(url) {
    
    let httpHeaders = new HttpHeaders().set('Authorization',this.getAuthToken()).set('Content-Type', 'application/json');
    return this.httpClient.get(this.baseUrl + url,{
      headers: httpHeaders
    }).pipe(map(response => response),
      catchError(this.errorHandler));
  }

  //Post request
  post_service(url, data) {
    
    let httpHeaders = new HttpHeaders().set('Authorization',this.getAuthToken()).set('Content-Type', 'application/json');
    return this.httpClient.post(this.baseUrl + url, JSON.stringify(data), {
      headers: httpHeaders
    }).pipe(map(response => response),
     catchError(this.errorHandler));
  }

  //Put request
  put_service(url, data) {
    
    let httpHeaders = new HttpHeaders().set('Authorization',this.getAuthToken()).set('Content-Type', 'application/json');
    return this.httpClient.put(this.baseUrl + url,JSON.stringify(data), {
      headers: httpHeaders
    }).pipe(map(response => response),
     catchError(this.errorHandler));
  }

  private errorHandler(errorObj: HttpErrorResponse | any){
    const _self = this;
    let errorMessage: string;
    let body: any;
    if (errorObj instanceof HttpErrorResponse) {
      if (errorObj.ok === false && errorObj.status === 0) {
        errorMessage = 'No internet connection or server might be unreachable. Please try again after sometime.';
      } else {
        body = errorObj.error || '';
        errorMessage = body;
        if (body.status_code === 401 || body.status_code === 107 || body.status_message === 'Session Expired') {
          localStorage.removeItem('Authorization');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    return Observable.throw(errorMessage);
  }

}
