import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../apiservices/data-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  private authListnerSub : Subscription;
  private cartListnerSub : Subscription;
  private wishlistListnerSub : Subscription;
  userIsAuthenticated  = false;
  cartCount : number;
  wishlistCount : number;

  constructor(private service : DataService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.service.getIsAuth();
    this.authListnerSub = this.service.getAuthStatusListner().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });

    this.cartListnerSub = this.service.getCartStatusListner().subscribe(cartCount => {
      this.cartCount = cartCount;
    });

    this.wishlistListnerSub = this.service.getWishlistStatusListner().subscribe(wishlistCount => {
      this.wishlistCount = wishlistCount;
    });
  }

  logout(){
    this.service.logout();
  }

  ngOnDestroy(){
    this.authListnerSub.unsubscribe();
    this.cartListnerSub.unsubscribe();
    this.wishlistListnerSub.unsubscribe();
  }

}
