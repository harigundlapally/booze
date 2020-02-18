import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ShopComponent } from './shop/shop.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './apiservices/auth-interceptor';
import { AuthGuard } from './apiservices/auth-guard';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'home', component: HomeComponent},
  { path: 'shop', component: ShopComponent},
  { path: 'product/:id', component: ProductDetailsComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'wishlist', component: WishlistComponent},
  { path : 'profile', loadChildren : () => import('src/app/profile/profile.module').then(m => m.ProfileModule) },
  { path : 'cart', loadChildren : () => import('src/app/cart/cart.module').then(m => m.CartModule),canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ShopComponent,
    ContactComponent,
    FooterComponent,
    SignupComponent,
    LoginComponent,
    AboutComponent,
    ProductDetailsComponent,
    WishlistComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
  ],
  providers: [AuthGuard,{provide : HTTP_INTERCEPTORS,useClass : AuthInterceptor, multi : true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
