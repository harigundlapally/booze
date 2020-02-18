import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $ : any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  firstLoad = true;
  constructor(private router : Router) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();   
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
  }
}
