import { Component, OnInit } from '@angular/core';
import { DataService } from '../apiservices/data-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private service : DataService) { }

  ngOnInit() {
  }

}
