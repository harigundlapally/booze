import { Component, OnInit } from '@angular/core';
import { DataService } from './apiservices/data-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wine';
  constructor(private service : DataService){}
  ngOnInit(){
    this.service.autoAuthUser();
    const isAuth = this.service.getIsAuth();
    if(isAuth){
      this.service.getCartData();
      this.service.getWishlistData();
    }
  }
}
