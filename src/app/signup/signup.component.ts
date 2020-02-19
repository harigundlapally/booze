import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from '../apiservices/data-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  firstLoad = true;
  constructor(public router: Router,public service: DataService) { }

  ngOnInit() {
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
  }

  onSignup(form : NgForm){
    const data = form.value;
    if(data){
      // this.service. = true;
      this.service.post_service(DataService.apisList.signup,data).subscribe(response => {
        this.router.navigateByUrl('/login');
        
      },(err) => {
        if(err){
          console.log(err);
        }
      });
    }
  }

}
