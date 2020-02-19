import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from '../../apiservices/data-service.service';
import { Subscription } from 'rxjs';
declare var $ : any;

@Component({
  selector: 'app-my-address',
  templateUrl: './my-address.component.html',
  styleUrls: ['./my-address.component.scss']
})
export class MyAddressComponent implements OnInit,OnDestroy {
  firstLoad = true;
  allAddress : any = [];
  addressFormTitle : string = 'Add New Address';
  cartAddressStatus : boolean = true;
  // address : {
  //   'name' : '',
  //   'contactNumber' : '',
  //   'address' : '',
  //   'email' : '',
  //   'state' : '',
  //   'city' : '',
  //   'country' : '',
  //   'pinCode' : '',
  // }
  address : any = {};
  states = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttarakhand","Uttar Pradesh","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli","Daman and Diu","Delhi","Lakshadweep","Puducherry"];
  addressStatusSub : Subscription;
  constructor( private service : DataService) { }

  ngOnInit() {
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
    this.getAllAddresses();
  }

  ngOnDestroy(){
    this.addressStatusSub.unsubscribe();
  }

  //get all addresses
  getAllAddresses(){
    const isAuth = this.service.getIsAuth();
    if(isAuth){
      this.service.getAllAddresses();
      this.addressStatusSub = this.service.getAddressListner().subscribe(response => {
        this.allAddress = response;
      });
    }
  }

  //address modal
  showAddressForm(){
    this.addressFormTitle = 'Add New Address';
    this.cartAddressStatus = true;
    $('#address-modal').modal('show');
  }

  //add new address
  onAddressSubmit(){
    const data = this.address;
    data.userId = localStorage.getItem('userId');
    if(this.cartAddressStatus){
      this.service.post_service(DataService.apisList.addAddress,data).subscribe(response => {
        if(response && response['result']){
          $('#address-modal').modal('hide');
          this.service.getAllAddresses();
        }
      },(err) => {
        if(err){
          console.log(err);
        }
      });
    }else{
      this.service.post_service(DataService.apisList.editAddress,data).subscribe(response => {
        if(response['result'] && response['result']['_id']){
          $('#address-modal').modal('hide');
        }
      },(err) => {
        if(err){
          console.log(err);
        }
      });
    }
  }

  //edit address
  editAddress(address){
    this.addressFormTitle = 'Edit Address';
    this.cartAddressStatus = false;
    $('#address-modal').modal('show');
    this.address = address;
  }

  //edit address
  deleteAddress(address){
    var data = {
      userId : localStorage.getItem('userId'),
      _id : address._id
    }
    this.service.post_service(DataService.apisList.deleteAddress,data).subscribe(response => {
      if(response){
        let allAddress = this.allAddress.filter(item => item._id != address._id);
        this.allAddress = [...allAddress];
      }
    },(err) => {
      if(err){
        console.log(err);
      }
    });
  }

  //make default checkout address
  makeDefaultCheckoutAddress(address){
    const data = address;
    data.userId = localStorage.getItem('userId');
    this.service.put_service(DataService.apisList.makeDefaultAddress,data).subscribe(response => {
      this.getAllAddresses();
    },(err) => {
      if(err){
        console.log(err);
      }
    });
  }

}
