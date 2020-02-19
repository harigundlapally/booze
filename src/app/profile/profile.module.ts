import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SettingsComponent } from './settings/settings.component';
import { MyWishlistComponent } from './my-wishlist/my-wishlist.component';
import { MyDetailsComponent } from './my-details/my-details.component';
import { FormsModule }   from '@angular/forms';


const routes: Routes = [
  { path: '', component: ProfileComponent,
    children: [
      {path: '',redirectTo: 'my-details',pathMatch: 'full'},
      { path: 'my-details', component: MyDetailsComponent},
      { path: 'my-orders', component: MyOrdersComponent},
      { path: 'change-password', component: ChangePasswordComponent},
      { path: 'settings', component: SettingsComponent},
      { path: 'my-wishlist', component: MyWishlistComponent},
    ]
  }
];

@NgModule({
  declarations: [ProfileComponent,MyDetailsComponent, MyOrdersComponent, ChangePasswordComponent, SettingsComponent, MyWishlistComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class ProfileModule { }
