import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  constructor() { }
  firstLoad = true;
  ngOnInit() {
    if(this.firstLoad) {
      window.scroll(0,0);
      this.firstLoad = false;
    }
  }

}
