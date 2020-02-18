import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  firstLoad = true;
  constructor() { }

  ngOnInit() {
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
  }

}
