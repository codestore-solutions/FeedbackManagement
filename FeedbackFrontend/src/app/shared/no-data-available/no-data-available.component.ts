import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-data-available',
  templateUrl: './no-data-available.component.html',
  styleUrls: ['./no-data-available.component.scss']
})
export class NoDataAvailableComponent {
  @Input() message:string = "";
}
