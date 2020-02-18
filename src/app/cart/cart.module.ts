import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { MyAddressComponent } from './my-address/my-address.component';
import { OrderPaymentComponent } from './order-payment/order-payment.component';


const routes: Routes = [
  { path: '', component: CartComponent,
    children: [
      {path: '',redirectTo: 'shopping-cart',pathMatch: 'full'},
      { path: 'shopping-cart', component: ShoppingCartComponent},
      { path: 'shipping-address', component: MyAddressComponent},
      { path: 'order-payment', component: OrderPaymentComponent},
    ]
  }
];

@NgModule({
  declarations: [CartComponent, ShoppingCartComponent, MyAddressComponent, OrderPaymentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CartModule { }
