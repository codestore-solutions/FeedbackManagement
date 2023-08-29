import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-number-rating',
  templateUrl: './number-rating.component.html',
  styleUrls: ['./number-rating.component.scss']
})
export class NumberRatingComponent {
  @Input() receivedNumberRating:number = 0;
}
