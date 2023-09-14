import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Observable, map, share } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  businessEmail!:string;
  isHandset$: Observable<boolean> = this._breakPoint.observe('(max-width: 850px)').pipe(
    map(result=>result.matches),
    share()
  );
  
  constructor(
    private _router: Router,
    private _breakPoint: BreakpointObserver
  ){}

  ngOnInit():void{
   this.businessEmail = JSON.parse(localStorage.getItem('user')!).email;
  }

  logout():void{
    localStorage.clear();
    this._router.navigate(["admin-login"]);
  }
}
