import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../apiservices/data-service.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Observable} from 'rxjs';



@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: []
})
export class CartComponent implements OnInit,OnDestroy {
  firstLoad = true;
  cartItems : any = [];
  addressItems : any = [];
  subtotalAmount : number = 0;
  totalAmount : number = 0;
  deliveryChargesAmount : number = 20;
  nextRoute : string;
  private cartDataListnerSub : Subscription;
  private addressDataListnerSub : Subscription;
  public orderType : string;
  public orderToken : string;

  constructor(private router:Router, private service : DataService,private activatedRoute:ActivatedRoute,public toastr: ToastrManager) {
    this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          if(this.router.url == '/cart/shopping-cart'){
            this.nextRoute = '/cart/shipping-address';
          }else if(this.router.url == '/cart/shipping-address'){
            this.nextRoute = '/cart/order-payment';
          }else if(this.router.url == '/cart/order-payment'){
            this.nextRoute = 'order-payment';
          }
        }
    });
  }

  ngOnInit() {
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
    this.getCartInformation();
  }

  ngOnDestroy() {
    this.cartDataListnerSub.unsubscribe();
    this.addressDataListnerSub.unsubscribe();
  }

  proceedToPay(){
    if(this.nextRoute != 'order-payment'){
      this.router.navigateByUrl(this.nextRoute)
    }else{
      let promise1 = new Promise((resolve, reject) => {
          let productIds = [];
          if(this.cartItems && !this.cartItems.length){
            const userId = localStorage.getItem('userId');
            this.service.get_service(DataService.apisList.cartData+'/'+userId).subscribe(response => {
              if(response && response['result'] && response['result'].length) {
                let count = 0;
                response['result'].map(cart => count += cart.quantity);
                this.cartItems = [...response['.result']];
                this.cartItems.map(cart => {
                  productIds.push({'productId': cart.productInfo[0]._id,'quantity' : cart.quantity})
                });
                resolve(productIds);
              }else{
                this.toastr.errorToastr('Please add items to cart and proceed', 'Error!');
                this.router.navigateByUrl('/shop');
                reject();
                return false;
              }
            },(err) => {
              if(err){
                console.log(err);
              }
            });
          }else {
            if(this.cartItems.length){
              this.cartItems.map(cart => {
                productIds.push({'productId': cart.productInfo[0]._id,'quantity' : cart.quantity})
              });
              resolve(productIds);
            }else{
              if(!productIds.length){
                this.toastr.errorToastr('Please add items to cart and proceed', 'Error!');
                this.router.navigateByUrl('/shop');
                reject();
                return false;
              }
            }
          }
      });
      let promise2 = new Promise((resolve, reject) => {
          if(this.addressItems && !this.addressItems.length){
              const userId = localStorage.getItem('userId');
              this.service.get_service(DataService.apisList.getAddresses+'/'+userId).subscribe(response => {
                if(response && response['result'] && response['result'].length) {
                  this.addressItems = [...response['result']];
                  resolve(this.addressItems);
                }else{
                  this.router.navigateByUrl('/cart/shipping-address')
                }
              },(err) => {
                if(err){
                  reject(err);
                }
              });
          } else {
            const address = this.addressItems.filter(address => address.defaultAddress == true);
            if(address.length){
              resolve(this.addressItems);
            }else{
              this.toastr.errorToastr('Please select default address to checkout', 'Error!');
              this.router.navigateByUrl('/cart/shipping-address');
              reject();
              return false;
            }
          }
      });
      let promise3 = new Promise((resolve, reject) => {
          if(this.service.orderType && this.service.orderToken){
            resolve(true);
          }
      });

      Promise.all([promise1, promise2, promise3]).then((results) => {
          if(results[0] && results[1] && results[2]) {
            const address = this.addressItems.filter(address => address.defaultAddress == true);
            const paymentType = this.service.orderType;
            const paymentToken = this.service.orderToken;
            const subtotalAmount = this.subtotalAmount;
            const deliveryChargesAmount = this.deliveryChargesAmount;
            const totalAmount = this.subtotalAmount + this.deliveryChargesAmount;
            const productIds = results[2]['productIds'];
            if(productIds.length && address.length){
              const orderPaymentObj = {
                productIds,
                addressId : address[0]._id,
                paymentType,
                subtotalAmount,
                deliveryChargesAmount,
                totalAmount,
                paymentToken
              };
              this.service.post_service(DataService.apisList.makePayment,orderPaymentObj).subscribe(response => {
                this.service.getCartData();
                this.router.navigateByUrl('/shop');
              },(err) => {
                if(err){
                  console.log(err);
                }
              });
            }
          }
      });
    }
  }

  getCartInformation(){
    this.cartDataListnerSub = this.service.getCartDataStatusListner().subscribe(response => {
      this.cartItems = response;
      this.getCartTotal();
    });
    
    this.addressDataListnerSub = this.service.getAddressListner().subscribe(response => {
      this.addressItems = response;
    });

  }

  getCartTotal(){
    let cartArray = [];
    this.cartItems.map(cart=> {
      cartArray.push(cart.quantity * cart.productInfo[0].listPrice);
    });
    this.subtotalAmount = cartArray.reduce(function(a, b){ return a + b; });
    this.totalAmount = this.subtotalAmount + this.deliveryChargesAmount;
  }

}
