import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../apiservices/data-service.service';
declare var $ : any;
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  firstLoad = true;
  productId:number = null;
  productData:any = {};
  private sub: any;
  constructor(private route: ActivatedRoute,private router: Router,public service : DataService) { }

  ngOnInit() {
    this.productId = this.route.snapshot.queryParams['id'];
    this.sub = this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.service.get_service(DataService.apisList.productDetails+this.productId).subscribe(response => {
        this.productData = response['product'];
      },(err) => {
        if(err){
          console.log(err);
        }
      });
    });
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
  }

  shop(){
    this.router.navigateByUrl('/shop');
  }

  addToCart(productId){
    const quantity = Number($('.productQuantity').val());
    let data = {
      productId,
      quantity,
      userId : localStorage.getItem('userId')
    }
    this.service.post_service(DataService.apisList.addToCart,data).subscribe(response => {
      console.log(response);
    },(err) => {
      if(err){
        console.log(err);
      }
    });
  }

  addToWishlist(productId){
    console.log(productId);
  }

}
