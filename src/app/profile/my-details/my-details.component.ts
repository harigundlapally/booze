import { Component, OnInit } from '@angular/core';
import { DataService } from '../../apiservices/data-service.service';

@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.scss']
})
export class MyDetailsComponent implements OnInit {
  firstLoad = true;
  user : any = {};
  constructor( private service : DataService) { }

  ngOnInit() {
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
    this.getUser();
  }

  getUser(){
    this.service.get_service(DataService.apisList.getUser).subscribe(response => {
      if(response && response['result']){
        this.user = {...response['result']};
      }
      
    });
  }

  onUpdateUser(){
    this.service.post_service(DataService.apisList.updateUser,this.user).subscribe(response => {
      if(response && response['result']){
        if(response['result'].n == 1){
          
        }
      }
    });
  }

}
