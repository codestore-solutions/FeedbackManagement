import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  todayDate:Date = new Date();

  constructor(private _router: Router){}

  ngOnInit():void{
   
  }

  logout():void{
    localStorage.clear();
    this._router.navigate(["admin-login"]);
  }
}
