import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
// import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';
import { DataService } from '../../apiservices/data-service.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.scss']
})
export class OrderPaymentComponent implements OnInit,OnDestroy {
  firstLoad = true;
  totalAmount : any = 0;
  subtotalAmount : any = 0;
  deliveryChargesAmount : any = 20;
  private cartItems : any;
  private cartDataListnerSub : Subscription;
  // public payPalConfig?: IPayPalConfig;
  private paypal : boolean = false;
  private alipay : boolean = false;
  private cybersource : boolean = false;
  private paypalClientId = environment.paypal.clientId;
  private paypalCurrency = environment.paypal.currency;
  private paymentTypes = [
      {
        displayName : 'Paypal',
        value : 'paypal'
      },
      {
        displayName : 'CyberSource',
        value : 'cybersource'
      },
      {
        displayName : 'Alipay',
        value : 'alipay'
      }
  ];
  constructor(private service : DataService) { }

  ngOnInit() {
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
    this.cartDataListnerSub = this.service.getCartDataStatusListner().subscribe(response => {
      this.cartItems = response;
      this.getCartTotal();
      this.cartItems = this.cartItems.map(cart => {
        return {
          name: cart.productInfo[0].name,
          quantity: cart.quantity,
          category: 'PHYSICAL_GOODS',
          unit_amount: {
            currency_code: this.paypalCurrency,
            value: +cart.productInfo[0].listPrice,
          },
        }
      });
    });
  }

  ngOnDestroy(){
    if(this.cartDataListnerSub){
      this.cartDataListnerSub.unsubscribe();
    }
  }

  getPaymentType(e){
    this.paypal = this.alipay = this.cybersource = false;
    if(e.target.value === 'paypal'){
      this.paypal = true;
      // this.initConfig();
    }
  }

  getCartTotal(){
    let cartArray = [];
    this.cartItems.map(cart=> {
      cartArray.push(cart.quantity * cart.productInfo[0].listPrice);
    });
    this.subtotalAmount = cartArray.reduce(function(a, b){ return a + b; });
    this.totalAmount = this.subtotalAmount + this.deliveryChargesAmount;
  }

  //paypal method
  // private initConfig(): void {
  //   console.log(this.cartItems);
  //   this.payPalConfig = {
  //     currency: this.paypalCurrency,
  //     clientId: this.paypalClientId,
  //     createOrderOnClient: (data) => <ICreateOrderRequest>{
  //         intent: 'CAPTURE',
  //         purchase_units: [
  //           {
  //             amount: {
  //               currency_code: this.paypalCurrency,
  //               value: this.totalAmount,
  //               breakdown: {
  //                 item_total : { 
  //                   currency_code : this.paypalCurrency,
  //                   value : this.subtotalAmount
  //                 },
  //                 shipping: {  
  //                   currency_code : this.paypalCurrency,
  //                   value : this.deliveryChargesAmount
  //                 }
  //               }
  //             },
  //             items: this.cartItems
  //           }
  //         ]
  //       },
  //       advanced: {
  //         commit: 'true'
  //       },
  //       style: {
  //         label: 'paypal',
  //         layout: 'vertical'
  //       },
  //       onApprove: (data, actions) => {
  //         console.log('onApprove - transaction was approved, but not authorized', data, actions);
  //         actions.order.get().then(details => {
  //           console.log('onApprove - you can get full order details inside onApprove: ', details);
  //         });
  //       },
  //       onClientAuthorization: (data) => {
  //         console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
  //           this.service.orderType = 'paypal';
  //           this.service.orderToken =  data['id'];
          
  //         // this.showSuccess = true;
  //       },
  //       onCancel: (data, actions) => {
  //         console.log('OnCancel', data, actions);
  //       },
  //       onError: err => {
  //         console.log('OnError', err);
  //       },
  //       onClick: (data, actions) => {
  //         console.log('onClick', data, actions);
  //       },
  //   };
  // }

}
