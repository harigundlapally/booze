import { Component, OnInit } from '@angular/core';
import { DataService } from '../../apiservices/data-service.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  firstLoad = true;
  passwordObj = {};
  constructor(private service : DataService) { }

  ngOnInit() {
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
  }

  //change password
  changePasswordSubmit(){
    let data = {...this.passwordObj};
    this.service.post_service(DataService.apisList.updatePassword,data).subscribe(resp => {
      if(resp && resp['result'] && resp['result'].n == 1){
        this.service.logout();
      }
    },(err) => {
      if(err){
        console.log(err);
      }
    });
  }

}
