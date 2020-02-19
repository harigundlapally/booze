import { Component, OnInit } from '@angular/core';
import { DataService } from '../../apiservices/data-service.service';
import { Router } from '@angular/router';
declare var $ : any;
@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  firstLoad = true;
  allOrders : any;
  states = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttarakhand","Uttar Pradesh","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli","Daman and Diu","Delhi","Lakshadweep","Puducherry"];
  constructor(private service : DataService, private router : Router) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();   
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
    this.getOrders();
  }

  getOrders(){
    this.service.get_service(DataService.apisList.getOrders).subscribe(resp => {
      
      this.allOrders = resp['orders'].map(order => {
        order.active = false;
        return order;
      });
    });
  }

  viewProductDetails(productId){
    this.router.navigateByUrl('/product/'+productId);
  }

  hideShowProducts(order){
    if(order.active == true){
      order.active = false;
    }else{
      order.active = true;
    }
  }

}
